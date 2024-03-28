# **Update Collection**

Eklemiş olduğunuz collection verisini güncellemek için kullanılır. Klasik bir update işlemi ile neredeyse aynı özellikleri barındırır.

Örnek olarak;

Daha önce **Add Collection** örneğinde eklemiş olduğumuz ürünün güncellemesini gerçekleştirelim.

Bkz. [Add Collection](./#/addcollection)

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    "id": "623cf3024d17dcf9d1418fb3",
    "fields": [
        {
            "field": "product_name",
            "value":"Nike T-Shirt"
        }
    ]
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

Fields dizisi içerisine güncellenecek verileri field ve value içeren Json Object'ler şeklinde ekleme yapabilirsiniz. İster **1(bir)** tane ister çoklu alan güncellemeleri yapabilirsiniz. <u> ***Dikkat: Sadece content içerisindeki verileri güncelleyebilirsiniz.***</u>

## **Urls:**

Post Url:

```html
https://your-serverip/api/update/collection
```

Android SDK:

```java
PostGet.URL_TYPE.updateCollection
```

iOS SDK:

```swift
URL_TYPE.updateCollection.description
```

React JS SDK:

```js
Methods.UpdateCollection
```

##