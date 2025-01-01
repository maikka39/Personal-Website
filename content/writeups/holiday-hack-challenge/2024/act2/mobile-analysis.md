+++
author = "Maik de Kruif"
title = "Mobile Analysis"
subtitle = "Act 2 - SANS Holiday Hack Challenge 2024"
date = 2024-12-31T16:54:46+01:00
description = "In Mobile Analysis, we assist Eve Snowshoes with debugging Santa's Naughty-Nice List app. For silver, we analyze a decompiled APK file, uncovering a missing child’s name through a SQL query. For gold, we tackle an obfuscated AAB file, decrypt hidden database triggers, and identify another excluded name using AES encryption—securing both medals!"
cover = "img/writeups/holiday-hack-challenge/2024/act2/mobile-analysis/cover.png"
tags = [
    "Holiday Hack Challenge",
    "ctf",
    "hacking",
    "writeup",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
+++

## Link

If you want to play the challenge yourself, you can find it here:

<https://2024.holidayhackchallenge.com/>

## Story line

Let's start off by talking to the elf:

> Hi there, tech saviour! Eve Snowshoes and Team Alabaster in need of assistance.
>
> I've been busy creating and testing a modern solution to Santa’s Naughty-Nice List, and I even built an Android app to streamline things for Alabaster’s team.
>
> But here’s my tiny reindeer-sized problem: I made a [debug](/files/writeups/holiday-hack-challenge/2024/act2/mobile-analysis/SantaSwipe.apk) version and a [release](/files/writeups/holiday-hack-challenge/2024/act2/mobile-analysis/SantaSwipeSecure.aab) version of the app.
>
> I accidentally left out a child's name on each version, but for the life of me, I can't remember who!
>
> Could you start with the debug version first, figure out which child’s name isn’t shown in the list within the app, then we can move on to release? I’d be eternally grateful!

<!-- [debug](https://www.holidayhackchallenge.com/2024/SantaSwipe.apk) -->
<!-- [debug](/files/writeups/holiday-hack-challenge/2024/act2/mobile-analysis/SantaSwipe.apk) -->

<!-- [release](https://www.holidayhackchallenge.com/2024/SantaSwipeSecure.aab) -->
<!-- [release](/files/writeups/holiday-hack-challenge/2024/act2/mobile-analysis/SantaSwipeSecure.aab) -->

## Hints

{{< collapsible-block title="Mobile Analysis Easy - Tools" isCollapsed="true" class="tight" >}}
Try using [apktool](https://github.com/iBotPeaches/Apktool/releases) or [jadx](https://github.com/skylot/jadx)
{{< /collapsible-block >}}

{{< collapsible-block title="Mobile Analysis Easy - Missing" isCollapsed="true" class="tight" >}}
Maybe look for what names are included and work back from that?
{{< /collapsible-block >}}

{{< collapsible-block title="Mobile Analysis Hard - Format" isCollapsed="true" class="tight" >}}
So yeah, have you heard about this new [Android app](https://developer.android.com/guide/app-bundle/app-bundle-format) format? Want to [convert it to an APK](https://github.com/HackJJ/apk-sherlock/blob/main/aab2apk.md) file?
{{< /collapsible-block >}}

{{< collapsible-block title="Mobile Analysis Hard - Encryption and Obfuscation" isCollapsed="true" class="tight" >}}
Obfuscated and encrypted? Hmph. Shame you can't just run [strings](https://developer.android.com/guide/topics/resources/string-resource) on the file.
{{< /collapsible-block >}}

## Recon

The conversation with the elf gives us two files; a debug, and a release version. The debug version is in [APK](<https://en.wikipedia.org/wiki/Apk_(file_format)>) format, while the release version is in [AAB](https://en.wikipedia.org/wiki/Android_App_Bundle) format.

## Silver

To be able to read the SantaSwipe.apk file properly, we can use [Jadx](https://github.com/skylot/jadx). There are two version of Jadx, the GUI and command line version. We can use the GUI version using `jadx-gui` like so:

```sh
jadx-gui SantaSwipe.apk
```

Or we can use the CLI to extract the files to a folder, in this case the folder `out/`.

```sh
jadx -d out SantaSwipe.apk
```

### Getting an understanding

In either case, we can navigate to the source code, and in there go to `com.northpole.santaswipe.MainActivity` to get an understanding of what the application does.

If this is the first time looking at an android application, it can be overwhelming. So it's important to pick a function and start from there. In this case there are a few to choose from: `onCreate`, `addToNaughtyList`, `addToNiceList`, `getNaughtyList`, `getNiceList`, `getNormalList` and `removeFromAllLists`.

The `onCreate` method is called first when the application is opened, so let's start there. Since the code we're seeing is reversed, it doesn't look the same as the original, and the fact that it was made in kotlin also doesn't help since that adds additional stuff.

We can start by ignoring/removing all lines with `Intrinsics.`, since that just adds some validation stuff which we don't need to know about. There are also some if conditions which do nothing, so we can forget about those as well. Also, the code shows five different `webView` variables, this is likely a mess up from the decompilation since they are all set to `this.myWebView`. We can also clean that up. If we then format it somewhat, we'll get the following code.

```java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    DatabaseHelper dbHelper = new DatabaseHelper(this);
    SQLiteDatabase writableDatabase = dbHelper.getWritableDatabase();
    this.database = writableDatabase;

    View findViewById = findViewById(R.id.webview);
    this.myWebView = (WebView) findViewById;

    this.myWebView.getSettings().setJavaScriptEnabled(true);

    final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
        .addPathHandler("/res/", new WebViewAssetLoader.ResourcesPathHandler(this))
        .build();

    this.myWebView.setWebViewClient(new WebViewClient() {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            return WebViewAssetLoader.this.shouldInterceptRequest(Uri.parse(url));
        }
    });

    this.myWebView.addJavascriptInterface(new WebAppInterface(), "Android");

    this.myWebView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
}
```

This is now much more readable, and we can actually see what is going on. The code starts by setting up a database connection. Then finds the webview, enables JavaScript, sets the asset locations, and finally loads `/assets/index.html`.

### Exploring the inner workings

This `index.html` file can be found under the resources in the assets folder, and contains the layout of the app. From reading it, is seems to load three lists: Normal/Unlisted, Nice and Naughty.

To find which user is missing, we'll start by looking at the normal list. It is filled using the `getNormalList` we found earlier in the `MainActivity`. If we clean up the code a little bit again, we'll have the following result:

```java
@JavascriptInterface
public final void getNormalList() {
    final String jsonItems;
    try {
        SQLiteDatabase sQLiteDatabase = MainActivity.this.database;
        Cursor cursor = sQLiteDatabase.rawQuery("SELECT Item FROM NormalList WHERE Item NOT LIKE '%Ellie%'", null);
        List items = new ArrayList();
        Log.d("WebAppInterface", "Fetching items from NormalList table");
        while (cursor.moveToNext()) {
            String item = cursor.getString(0);
            items.add(item);
            Log.d("WebAppInterface", "Fetched item: " + item);
        }
        cursor.close();
        if (items.isEmpty()) {
            jsonItems = "[]";
        } else {
            jsonItems = CollectionsKt.joinToString$default(items, "\",\"", "[\"", "\"]", 0, null, null, 56, null);
        }
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public final void run() {
                MainActivity.WebAppInterface.getNormalList$lambda$0(jsonItems, MainActivity.this);
            }
        });
    } catch (Exception e) {
        Log.e("WebAppInterface", "Error fetching NormalList: " + e.getMessage());
    }
}
```

Immediately on one of the first lines we can see an SQL query.

```sql
SELECT Item FROM NormalList WHERE Item NOT LIKE '%Ellie%'
```

The query gets all items on the list, but excludes all containing "Ellie". This is thus the user missing, and if we submit the answer... it gets accepted!

## Gold

### Continued story line

Let's first talk to the elf again, he'll tell us what we'll have to do for gold.

> Aha! Success! You found it!
>
> Thanks for staying on your toes and helping me out—every step forward keeps Alabaster’s plans on track. You're a real lifesaver!
>
> Nice job completing the debug version—smooth as a sleigh ride on fresh snow!
>
> But now, the real challenge lies in the obfuscated release version. Ready to dig deeper and show Alabaster’s faction your skills?

### Exploration

Okay, so this time we got an AAB file. I hadn't heard of this format before, and so looked into converting it to an APK file. This can be done pretty easily using [bundletool](https://developer.android.com/tools/bundletool).

```sh
bundletool build-apks --bundle=SantaSwipeSecure.aab --output=SantaSwipeSecure.apks --mode=universal
unzip SantaSwipeSecure.apks
```

This will output a file called `universal.apk`, which we can use with `jadx`. This, however, turned out to be completely unnecessary as `jadx` supports AAB files natively. Let's proceed using that method.

```sh
jadx -d out SantaSwipeSecure.aab
```

Now that we have reconstructed some Java files from it, we can look at the code again. We'll take the same route here as for silver, and start at the `onCreate` method in the `MainActivity.java` file. After cleaning up the file a little it will look as follows.

```java
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        String string = getString(R.string.iv);
        byte[] decode = Base64.decode(StringsKt.trim((CharSequence) string).toString(), 0);
        this.staticIv = decode;
        String string2 = getString(R.string.ek);
        byte[] decode2 = Base64.decode(StringsKt.trim((CharSequence) string2).toString(), 0);
        this.secretKey = new SecretKeySpec(decode2, 0, decode2.length, "AES");
        initializeDatabase();
        initializeWebView();
        initializeEncryption();
    } catch (IllegalArgumentException e) {
        Log.e("MainActivity", "Error during initialization: " + e.getMessage());
    }
}

private final void initializeDatabase() {
    SQLiteDatabase writableDatabase = new DatabaseHelper(this).getWritableDatabase();
    this.database = writableDatabase;
}

private final void initializeWebView() {
    // Same as the SantaVision.apk's MainActivity.onCreate.
    // Sets up and loads the index.html file, which is also the same.
}

private final void initializeEncryption() {
}
```

I also included three other functions here, as they are being called in the `onCreate` method. Next to these methods, the `WebAppInterface` methods `addToNaughtyList`, `addToNiceList`, `getNaughtyList`, `getNiceList`, `getNormalList` and `removeFromAllLists` are also here again, but they have a different implementation now.

We can see that this time `onCreate` start by getting some string values, base64 decoding them, and saving them in the `staticIv` and `secretKey` variables. We can also see a reference to AES, meaning there is likely some encryption going on.

The get the values of these strings, we can refer to the `resources/res/values/strings.xml` file. This is where strings are stored in android to allow for localization. Looking in the file we can find the following two entries that are referenced.

```xml
<!-- ... -->
<string name="ek">rmDJ1wJ7ZtKy3lkLs6X9bZ2Jvpt6jL6YWiDsXtgjkXw=</string>
<!-- ... -->
<string name="iv">Q2hlY2tNYXRlcml4</string>
<!-- ... -->
```

After getting the values, the `onCreate` method is calling the `initializeWebView` method, which has the same implementation as SantaVision.apk's `MainActivity`'s `onCreate` method. It also calls `initializeEncryption`, but this seems to be an empty method.

Since the `index.html` file is also the same as before, let's proceed at the `getNormalList` method.

```java
@JavascriptInterface
public final void getNormalList() {
    try {
        SQLiteDatabase sQLiteDatabase = MainActivity.this.database;
        Cursor rawQuery = sQLiteDatabase.rawQuery("SELECT Item FROM NormalList", null);
        ArrayList arrayList = new ArrayList();
        while (rawQuery.moveToNext()) {
            String string = rawQuery.getString(R.xml.backup_rules);
            String decryptData = decryptData(string);
            if (decryptData != null) {
                arrayList.add(decryptData);
            }
        }
        rawQuery.close();
        final String joinToString$default = arrayList.isEmpty() ? "[]"
                : CollectionsKt.joinToString$default(arrayList, "\",\"", "[\"", "\"]", R.xml.backup_rules, null,
                        null, R.string.m3c_bottom_sheet_pane_title, null);
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public final void run() {
                MainActivity.WebAppInterface.getNormalList$lambda$0(MainActivity.this, joinToString$default);
            }
        });
    } catch (Exception unused) {
    }
}
```

This method again looks roughly the same, but, unfortunately, the answer isn't in the query this time. We do see a peculiar function call at `String decryptData = decryptData(string)`. It looks like the database is returning the data in an encrypted form. Let's take a look at the implementation of the `decryptData` method.

```java
private final String decryptData(String encryptedData) {
    try {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] bArr = MainActivity.this.staticIv;
        GCMParameterSpec gCMParameterSpec = new GCMParameterSpec(128, bArr);
        SecretKey secretKey = MainActivity.this.secretKey;
        cipher.init(R.styleable.FontFamily, secretKey, gCMParameterSpec);
        byte[] doFinal = cipher.doFinal(Base64.decode(encryptedData, R.xml.backup_rules));
        return new String(doFinal, Charsets.UTF_8);
    } catch (Exception unused) {
        return null;
    }
}
```

It seems to be using the AES cipher with the credentials we saw before to decrypt the data. Let take a look at how exactly that database works by navigating to the `DatabaseHelper.java` file. We'll start at the constructor.

```java
public DatabaseHelper(Context context) {
    super(context, DATABASE_NAME, (SQLiteDatabase.CursorFactory) null, R.xml.data_extraction_rules);
    String string = context.getString(R.string.ek);
    String obj = StringsKt.trim((CharSequence) string).toString();
    String string2 = context.getString(R.string.iv);
    String obj2 = StringsKt.trim((CharSequence) string2).toString();
    byte[] decode = Base64.decode(obj, R.xml.backup_rules);
    this.encryptionKey = decode;
    byte[] decode2 = Base64.decode(obj2, R.xml.backup_rules);
    this.iv = decode2;
    this.secretKeySpec = new SecretKeySpec(decode, "AES");
}
```

Here we find the same kind of setup as in the MainActivity, it loads the same AES key and iv values and saves them. Let's proceed to the `onCreate` method.

```java
@Override
public void onCreate(SQLiteDatabase db) {
    db.execSQL("CREATE TABLE IF NOT EXISTS NiceList (Item TEXT);");
    db.execSQL("CREATE TABLE IF NOT EXISTS NaughtyList (Item TEXT);");
    db.execSQL("CREATE TABLE IF NOT EXISTS NormalList (Item TEXT);");
    db.execSQL(decryptData("IVrt+9Zct4oUePZeQqFwyhBix8cSCIxtsa+lJZkMNpNFBgoHeJlwp73l2oyEh1Y6AfqnfH7gcU9Yfov6u70cUA2/OwcxVt7Ubdn0UD2kImNsclEQ9M8PpnevBX3mXlW2QnH8+Q+SC7JaMUc9CIvxB2HYQG2JujQf6skpVaPAKGxfLqDj+2UyTAVLoeUlQjc18swZVtTQO7Zwe6sTCYlrw7GpFXCAuI6Ex29gfeVIeB7pK7M4kZGy3OIaFxfTdevCoTMwkoPvJuRupA6ybp36vmLLMXaAWsrDHRUbKfE6UKvGoC9d5vqmKeIO9elASuagxjBJ"));
    insertInitialData(db);
}
```

Here we find something interesting. One of the queries that will be executed on startup is encrypted. The `decryptData` method in the DatabaseHelper is slightly different, but it works exactly the same as the other one. Let's continue by decrypting that data. Since we already found the key (ek) and initialization vector (iv), that should be fairly straightforward.

### Solving

I choose to use Python for the decryption, but you can use whichever language you prefer.

```py
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64

iv = base64.b64decode("Q2hlY2tNYXRlcml4")
ek = base64.b64decode("rmDJ1wJ7ZtKy3lkLs6X9bZ2Jvpt6jL6YWiDsXtgjkXw=")


def decryptData(encryptedData):
    return AESGCM(ek).decrypt(iv, base64.b64decode(encryptedData), None)


print(
    decryptData(
        "IVrt+9Zct4oUePZeQqFwyhBix8cSCIxtsa+lJZkMNpNFBgoHeJlwp73l2oyEh1Y6AfqnfH7gcU9Yfov6u70cUA2/OwcxVt7Ubdn0UD2kImNsclEQ9M8PpnevBX3mXlW2QnH8+Q+SC7JaMUc9CIvxB2HYQG2JujQf6skpVaPAKGxfLqDj+2UyTAVLoeUlQjc18swZVtTQO7Zwe6sTCYlrw7GpFXCAuI6Ex29gfeVIeB7pK7M4kZGy3OIaFxfTdevCoTMwkoPvJuRupA6ybp36vmLLMXaAWsrDHRUbKfE6UKvGoC9d5vqmKeIO9elASuagxjBJ"
    )
)
```

This will yield us the following result.

```sql
CREATE TRIGGER DeleteIfInsertedSpecificValue
    AFTER INSERT ON NormalList
    FOR EACH ROW
    BEGIN
        DELETE FROM NormalList WHERE Item = 'KGfb0vd4u/4EWMN0bp035hRjjpMiL4NQurjgHIQHNaRaDnIYbKQ9JusGaa1aAkGEVV8=';
    END;
```

That is very interesting, a trigger is being made which will remove every item matching another encrypted string. Let's lake a look at what the decrypted version looks like.

```py
decryptData("KGfb0vd4u/4EWMN0bp035hRjjpMiL4NQurjgHIQHNaRaDnIYbKQ9JusGaa1aAkGEVV8=")
b'Joshua, Birmingham, United Kingdom'
```

It seems like Joshua is not allowed to be on the list, let's check that name for the gold medal. Woo-hoo, it's correct!

## Final elf message

> Aha! Success! You found it!
>
> Thanks for staying on your toes and helping me out—every step forward keeps Alabaster’s plans on track. You're a real lifesaver!
