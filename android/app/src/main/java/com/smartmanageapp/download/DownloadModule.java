package com.smartmanageapp.download;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.smartmanageapp.MainActivity;
import com.smartmanageapp.utils.PermissionsUtil;

import java.io.File;
import java.util.Collections;
import java.util.concurrent.Callable;

/**
 * 使用系统下载功能
 * Created by xxy on 2017/12/9.
 */

public class DownloadModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;
    private MainActivity activity;

    public DownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Download";
    }

    /**
     * downloadUrl     下载链接
     * fileName        文件的名称
     * title           通知的标题
     * desc            通知的描述
     * filePath        文件的保存位置
     * successCallback 回调返回下载的id
     * errorCallback   错误信息回调
     */
    @ReactMethod
    public void download(final ReadableMap options, final Promise promise) {
        activity = (MainActivity) getCurrentActivity();

        if (activity == null) {
            promise.reject("Activity doesn't exist", "下载失败！");
            return;
        }

        final String downloadUrl = options.hasKey("downloadUrl") ? options.getString("downloadUrl") : "";
        final String fileName = options.hasKey("fileName") ? options.getString("fileName") : "";
        final String title = options.hasKey("title") ? options.getString("title") : "";
        final String desc = options.hasKey("desc") ? options.getString("desc") : "";
        final String filePath = options.hasKey("filePath") ? options.getString("filePath") : "";

        PermissionsUtil.permissionsCheck(activity, promise, Collections.singletonList(Manifest.permission.WRITE_EXTERNAL_STORAGE), new Callable<Void>() {
            @Override
            public Void call() throws Exception {// 创建下载请求
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(downloadUrl));

                /*
                 * 设置在通知栏是否显示下载通知(下载进度), 有 3 个值可选:
                 *    VISIBILITY_VISIBLE:                   下载过程中可见, 下载完后自动消失 (默认)
                 *    VISIBILITY_VISIBLE_NOTIFY_COMPLETED:  下载过程中和下载完成后均可见
                 *    VISIBILITY_HIDDEN:                    始终不显示通知
                 */
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

                // 设置通知的标题和描述
                if (title == null || title.isEmpty()) {
                    request.setTitle("正在下载");
                } else {
                    request.setTitle(title);
                }
                request.setDescription(desc);

                /*
                 * 设置允许使用的网络类型, 可选值:
                 *     NETWORK_MOBILE:      移动网络
                 *     NETWORK_WIFI:        WIFI网络
                 *     NETWORK_BLUETOOTH:   蓝牙网络
                 * 默认为所有网络都允许
                 */
                // request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI);

                // 添加请求头
                // request.addRequestHeader("User-Agent", "Chrome Mozilla/5.0");

                // 设置下载文件的保存位置
                File saveFile = new File(Environment.getExternalStorageDirectory(), ((filePath == null || filePath.isEmpty()) ? "" : (filePath + "/")) + fileName);
                request.setDestinationUri(Uri.fromFile(saveFile));

                DownloadManager manager = (DownloadManager) reactContext.getSystemService(Context.DOWNLOAD_SERVICE);

                // 将下载请求加入下载队列, 返回一个下载ID
                final long downloadId = manager.enqueue(request);
                //监听下载进度
                activity.queryDownload(reactContext, downloadId);

                WritableMap params = Arguments.createMap();
                params.putString("downloadId", Long.toString(downloadId));
                promise.resolve(params);
                return null;
            }
        });
    }

    /**
     * 查询下载状态
     *
     * @param downloadId 下载id
     */
    public static int query(Context context, ReactApplicationContext reactContext, Long downloadId) {
        // 获取下载管理器服务的实例
        DownloadManager manager = (DownloadManager) reactContext.getSystemService(Context.DOWNLOAD_SERVICE);

        DownloadManager.Query query = new DownloadManager.Query();

        // 根据 下载ID 过滤结果
        query.setFilterById(downloadId);

        // 还可以根据状态过滤结果
        // query.setFilterByStatus(DownloadManager.STATUS_SUCCESSFUL);

        // 执行查询, 返回一个 Cursor (相当于查询数据库)
        Cursor cursor = manager.query(query);

        WritableMap params = Arguments.createMap();
        if (!cursor.moveToFirst()) {
            cursor.close();
            params.putInt("status", 16);
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("download", params);
            return 16;
        }

        // 下载ID
//        long id = cursor.getLong(cursor.getColumnIndex(DownloadManager.COLUMN_ID));

        /*
         * 判断是否下载成功，其中状态 status 的值有 5 种:
         *     DownloadManager.STATUS_PENDING:      等待下载    1
         *     DownloadManager.STATUS_RUNNING:      正在下载    2
         *     DownloadManager.STATUS_PAUSED:       下载暂停    4
         *     DownloadManager.STATUS_SUCCESSFUL:   下载成功    8
         *     DownloadManager.STATUS_FAILED:       下载失败    16
         */
        // 下载请求的状态
        int status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
        /*
         * 特别注意: 查询获取到的 localFilepath 才是下载文件真正的保存路径，在创建
         * 请求时设置的保存路径不一定是最终的保存路径，因为当设置的路径已是存在的文件时，
         * 下载器会自动重命名保存路径，例如: .../demo-1.apk, .../demo-2.apk
         * "下载成功, 打开文件, 文件路径: " + localFilename
         */
        // 下载文件在本地保存的路径（Android 7.0 以后 COLUMN_LOCAL_FILENAME 字段被弃用, 需要用 COLUMN_LOCAL_URI 字段来获取本地文件路径的 Uri）
        String localFilepath = cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI));
        // 已下载的字节大小
        long downloadedSoFar = cursor.getLong(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
        // 下载文件的总字节大小
        long totalSize = cursor.getLong(cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));

        cursor.close();

//        String progress = new DecimalFormat("0.00%").format((float) downloadedSoFar / (float) totalSize);

        params.putInt("progress", (int) (((float) downloadedSoFar / (float) totalSize) * 100));
        params.putDouble("downloadedSize", (double) downloadedSoFar);
        params.putDouble("totalSize", (double) totalSize);
        params.putInt("status", status);
        params.putString("localFilepath", localFilepath);

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("download", params);
        if (status == DownloadManager.STATUS_SUCCESSFUL) {
            File file = new File(Uri.parse(localFilepath).getPath());
            String fileName = file.getName();
            String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
            if (suffix.equals("apk")) {
                installApk(context, Uri.parse(localFilepath));
                ((Activity) context).finish();
            }
        }
        return status;
    }

    public static void installApk(Context context, Uri uri) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri data;
        // 判断版本大于等于7.0
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            // "net.csdn.blog.ruancoder.fileprovider"即是在清单文件中配置的authorities
            data = FileProvider.getUriForFile(context, context.getPackageName() + ".provider", new File(uri.getPath()));
            // 给目标应用一个临时授权
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            data = uri;
        }
        intent.setDataAndType(data, "application/vnd.android.package-archive");
        context.startActivity(intent);
    }
}
