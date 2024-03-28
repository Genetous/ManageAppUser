# **File Upload**

**Genetous** Dosyalarınızı depolamanız için size **Object Storage Servis**'i sunar. **Object Storage Servis**'e upload işlemini örnekleyelim;

```ruby
POST objectstore/upload/file HTTP/1.1
Host: your-serverip
Content-Length: 360
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="your local file path"
Content-Type: <Content-Type header here>

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="bucket"

your applicationId
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

## **Not:**

*Yukarıda ki örnek bir form-data'nın http çıktısıdır. Form-Data içerisinde file etiketi ile dosyanızı bucket etiketi ile applicationId'nizi göndermeniz yeterli olacaktır.*

## **Urls:**

Post Url:

```html
https://your-serverip/objectstore/upload/file
```

Android SDK:

```java
PostGet.URL_TYPE.uploadFile
```

iOS SDK:

```swift
URL_TYPE.uploadFile.description
```

React JS SDK:

```js
Methods.UploadFile
```

##