package com.smartmanageapp;

import android.app.DownloadManager;
import android.os.Bundle;
import android.os.Handler;
import android.webkit.WebView;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.smartmanageapp.splash.SplashScreen;
import com.smartmanageapp.download.DownloadModule;

public class MainActivity extends ReactActivity {
  
  public Handler handler = new Handler();
  public Runnable runnable;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "smartmanageapp";
  }

  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, true);
      super.onCreate(savedInstanceState);
  }

  public void queryDownload(final ReactApplicationContext reactContext, final long downloadId) {
    //定时查询下载进度（1000为毫秒）
    runnable = new Runnable() {
        @Override
        public void run() {
            int status = DownloadModule.query(MainActivity.this, reactContext, downloadId);
            if (status == DownloadManager.STATUS_SUCCESSFUL | status == DownloadManager.STATUS_FAILED) {
                handler.removeCallbacks(runnable);
            } else {
                handler.postDelayed(this, 1000);
            }
        }
    };
    handler.postDelayed(runnable, 1000);
  }
}
