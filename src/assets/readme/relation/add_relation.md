# **Add Relation**

Relation ekleme işlemi, diğer yapılara göre biraz farklılık göstermektedir. **Genetous** ta relation oluşturmak iki collection' ı biri ana collection diğeri ise onun la ilişkide olan alt koleksiyon olarak şeklinde gerçekleşir. Ana koleksiyona bağlı ilişkide olan alt koleksiyonlar olarak değerlendirmelisiniz.

Örneklemek gerekirse;

-Bir kategori koleksiyonumuz olsun. Adına ***Elektronik*** diyelim.
-Bir başka kategori koleksiyonu oluşturalım. Adına ***Bilgisayar*** diyelim.
-***Bilgisayar*** kategorisi ***Elektronik*** kategorisinin alt kategorisi olacaktır.
-Kısacası ***Elektronik*** kategorisi ana kategori ***Bilgisayar*** kategorisi ise ona bağlı alt kategori olacaktır.

Kod örneği ile detaylandıralım;

Önce ***Elektronik*** kategorisini kategori olarak ekleyelim;

```json
{
    "collectionName": "category",
    "content": {
        "category_name": "Elektronik",
    }
}
```

Şimdi  ***Bilgisayar*** kategorisini alt kategori koleksiyonu olarak ekleyelim;

```json
{
    "collectionName": "subcategory",
    "content": {
        "category_name": "Bilgisayar",
    }
}
```

Daha sonra ***Ekeltronik*** kategorisi ana kategori ***Bilgisayar*** kategorisi ise ***Elektronik*** kategorisinin alt kategori olacak şekilde  ilişkilendirelim;

```json
{
    "relations": [
        {
            "relationName": "categoryRelations",
            "id": "6084c33c179a24080f92be49" //Elektronik Kategorisinin id'si
        }
    ],
    "contents": [
        {
            "id": "6084c38d179a24080f92be4c" // Bilgisayar kategorisinin id'si
        }
    ]
}
```

Yukarıdaki örnekte daha önce oluşturulmuş iki koleksiyonu birbirleri ile ilişkilendirdik.

Ancak **Genetous** size yeni koleksiyon oluşturma esnasında da mevcut bir koleksiyon ile ilişki kurabilme seçeneğini sağlar.

Örnekleyelim;

***Elektronik*** kategorimiz mevcutta eklenmiş durumda.

***Cep Telefonu*** kategorisini oluştururken ***Elektronik*** kategorisi ile ilişkilendirelim.

```json
{
    "relations": [
        {
            "relationName": "categoryRelations",
            "id": "6084c33c179a24080f92be49" //Elektronik Kategorisinin id'si
        }
    ],
    "contents": [
        {
            "collectionName": "subcategory",
            "content": {
                "category_name": "Cep Telefonu",
            }
        }
    ]
}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

```json
[
    {
        "subcategory_id": "623d48062639c68cb7bba8d2"
    }
]
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

İşlemin sonucunda ***Cep Telefonu*** koleksiyonu oluşturulmuş ve ***Elektronik*** kategorisi ile ilişkilendirilmiş olacaktır.

<u>**Genetous** temel olarak çağırma esnasında veri toplamak yerine çağıracağınız verilerin önceden planlanarak oluşturulmasını esas alır. İlişki oluşturma mantığı buna dayanır.</u>

Yukarıdaki örnekte planımız, elektronik kategorisini çağırdığımızda onunla ilişkili olan tüm verilerin çağırılabilmesi esasını gerçekleştirmekti.

İlişkili verilerin tamamını çağırmak kulağa korkutucu gelebilir. Ancak **Genetous** size bu verilerin filtrelenmesi için de seçenekler sunar.

Bkz. [Get Relations](./#/getrelations)

## **relationName:**

Kurulan ilişkiye verilecek isim alanıdır. Bu sayede aynı koleksiyonlarla başka isim altında farklı ilişkiler oluşturabilirsiniz.

## **contents:**

Bu alan dizi şeklinde kullanılır. Oluşturulmuş koleksiyonu eklemek için id'sini Json Object olarak kullanmak yeterli olacaktır. Yeni koleksiyon oluşturulacak ise koleksiyonun tüm datalarını içeren Json Object şeklinde ekleme yapılmalıdır.


## **Urls:**

Post Url:

```html
https://your-serverip/api/add/relation
```

Android SDK:

```java
PostGet.URL_TYPE.addRelation
```

iOS SDK:

```swift
URL_TYPE.addRelation.description
```

React JS SDK:

```js
Methods.AddRelation
```

##
