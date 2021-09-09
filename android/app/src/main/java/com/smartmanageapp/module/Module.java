package com.smartmanageapp.module;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.view.View;

import com.smartmanageapp.MainActivity;
import com.smartmanageapp.utils.PermissionsUtil;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;


/**
 * 使用系统模块
 * Created by xxy on 2017/12/22.
 */

public class Module extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;
    private MainActivity activity;

    public Module(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

    }

    @Override
    public String getName() {
        return "Module";
    }

    @ReactMethod
    public void exitApp() {
        Runtime.getRuntime().exit(0);
    }

    @ReactMethod
    public void call(ReadableMap options) {
        String phone = options.getString("phone");
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phone));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void openAPN() {
        Intent vpnIntent = new Intent();
        vpnIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        vpnIntent.setAction("android.settings.APN_SETTINGS");
        vpnIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(vpnIntent);
    }

    @ReactMethod
    public void openVPN() {
        Intent vpnSettingIntent = new Intent();
        vpnSettingIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        vpnSettingIntent.setAction(Settings.ACTION_VPN_SETTINGS);
        vpnSettingIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(vpnSettingIntent);
    }


    @ReactMethod
    public void openNotification() {
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Intent intent = new Intent();
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("app_package", reactContext.getPackageName());
            intent.putExtra("app_uid", reactContext.getApplicationInfo().uid);
            reactContext.startActivity(intent);
        } else if (android.os.Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
            Intent intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.setData(Uri.parse("package:" + reactContext.getPackageName()));
            reactContext.startActivity(intent);
        }
    }
    

}
