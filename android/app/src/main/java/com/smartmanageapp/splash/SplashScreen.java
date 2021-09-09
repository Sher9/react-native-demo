package com.smartmanageapp.splash;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.widget.TextView;

import com.smartmanageapp.R;

import java.lang.ref.WeakReference;

/**
 * SplashScreen
 * 启动屏
 * from：http://www.devio.org
 * Author:CrazyCodeBoy
 * GitHub:https://github.com/crazycodeboy
 * Email:crazycodeboy@gmail.com
 */
public class SplashScreen {
    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity, final boolean fullScreen) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {

                    mSplashDialog = new Dialog(activity, fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme);
                    mSplashDialog.setContentView(R.layout.launch_screen);
                    mSplashDialog.setCancelable(false);

                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                    }
                }
            }
        });
    }

    /**
     * 打开启动屏
     */
    public static void show(final Activity activity) {
        show(activity, false);
    }

    /**
     * 关闭启动屏
     */
    public static void hide(Activity activity) {
        if (activity == null) {
            if (mActivity == null) {
                return;
            }
            activity = mActivity.get();
        }
        if (activity == null) return;

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    mSplashDialog.dismiss();
                    mSplashDialog = null;
                }
            }
        });
    }

    /**
     * 设置加载文本内容
     */
    public static void setLoadingText(Context context, final String text) {
        if (mSplashDialog != null) {
            ((Activity)context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ((TextView) mSplashDialog.findViewById(R.id.loading_text)).setText(text);
                }
            });
        }
    }
}
