# **Delete Collection**

Eklemiş olduğunuz collection verisini silmek için kullanılır. Klasik bir silme işlemi ile neredeyse aynı özellikleri barındırır.

Örnek olarak;

Daha önce **Add Collection** örneğinde eklemiş olduğumuz ürünün silme işlemini gerçekleştirelim.

Bkz. [Add Collection](./#/addcollection)

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    "id": "6029f23e2b33c7fa1584dcb5"
}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

## **Not:**

Silme işlemini gerçekleştirmek için koleksiyonun id verisini göndermek yeterli olacaktır.

## **Urls:**

Post Url:

```html
https://your-serverip/api/delete/collection
```

Android SDK:

```java
PostGet.URL_TYPE.deleteCollection
```

iOS SDK:

```swift
URL_TYPE.deleteCollection.description
```

React JS SDK:

```js
Methods.DeleteCollection
```

##