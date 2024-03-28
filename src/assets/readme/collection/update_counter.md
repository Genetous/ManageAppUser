# **Update Counter**

Eklemiş olduğunuz collection verisi içerinde sayısal arttırma ve azaltma işlemleri için kullanılır.

Örnek olarak;

Daha önce **Add Collection** örneğinde eklemiş olduğumuz ürünün satış sayısını güncellemeyi gerçekleştirelim.

Bkz. [Add Collection](./#/addcollection)

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    "id": "623cf3024d17dcf9d1418fb3",
    "fields": [
        {
            "field": "product_sales_count",
            "increase": 1,
            "type": "counter"
        }
    ]
}
```

Yukarıdaki örnekte satış sayısını ***1(bir)*** arttırdık.

Birde azaltma işlemini örneklendirelim;

```json
{
    "id": "623cf3024d17dcf9d1418fb3",
    "fields": [
        {
            "field": "product_sales_count",
            "increase": -1,
            "type": "counter"
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

Arttırma ve azaltma işlemi için dilediğiniz ölçekte bir değer verebilirsiniz.

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