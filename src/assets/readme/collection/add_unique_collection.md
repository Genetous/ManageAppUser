# **Add Unique Collection**

Collection ekleme işlemini yeni tablo oluşturmak veya mevcuttaki bir tabloya kayıt eklemek olarak değerlendirebilirsiniz. Add Unique Collection da benzersiz alanlar oluşturabilmenizi sağlar.

Örnek olarak;

Kullanıcı oluşturma işleminde kullanıcı adının ve kullanıcının e-posta adresinin benzersiz olmasını isteyebilirsiniz.

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    
    "collectionName": "user",
    "content": {
        "user_username": "genetous_user_1",
        "user_pass":"12345678",
        "user_email":"example@example.com",
        "user_createdDate":1613108559,
        "uniqueFields":["user_username","user_email"]
    }

}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

```json
{
    "id": "623cf5944d17dcf9d1418fba"
}
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

Unique olmayan içerik hatası;

```ruby
Status Code : 400
```

```json
{
    "result": "DB Contains Unique Field"
}
```

## **uniqueFields:**

Bu alan array olarak content içeriğinde hangi alanların benzersiz olması gerektiğini belirteceğiniz alandır. Bu alan içerisinde belirttiğiniz alan isimleri kontrol edilerek **unique** veriler ise kayıt işlemi gerçekleştirilir. Alanlardan herhangi bir tanesi **unique** değil ise size sonuç olarak hata dönecektir.

## **Urls:**

Post Url:

```html
https://your-serverip/api/add/unique/collection
```

Android SDK:

```java
PostGet.URL_TYPE.addUniqueCollection
```

iOS SDK:

```swift
URL_TYPE.addUniqueCollection.description
```

React JS SDK:

```js
Methods.AddUniqueCollection
```

##