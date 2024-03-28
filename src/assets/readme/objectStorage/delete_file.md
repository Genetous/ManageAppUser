# **Delete File**

Yüklediğiniz dosyaları silme işlemini gerçekleştireceğiniz fonksiyondur.

Json modeli şöyle olmalıdır;

```json
{
    "applicationId":your applicationId,
    "files":[
        "filename.file_extension"
    ]
}
```

## **Urls:**

Post Url:

```html
https://your-serverip/objectstore/delete
```

Android SDK:

```java
PostGet.URL_TYPE.deleteFile
```

iOS SDK:

```swift
URL_TYPE.deleteFile.description
```

React JS SDK:

```js
Methods.DeleteFile
```

##