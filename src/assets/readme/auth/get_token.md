# **Get Token**

**Genetous** full-generic yapısı sebebiyle her işlem için en azından ***guest token*** almayı zorunlu kılar. ***Guest*** token aldıktan sonra kayıtlı kullanıcı için token oluşturulabilir. Token oluşturmadan **Authentication/Authorization** servis dışında herhangi bir servisi kullanamazsınız. Alınan token verisi **Bearer** token olarak kullanılmalıdır.

Öncelikle guest token alma işlemi ile başlayalım.

Örnekle detaylandıralım;

**Url:**

```html
https://your-serverip/auth/client
```

```json
{
    "application_id":your applicationId,
    "organization_id":your organizationId
}
```

Bu işlem sonucunda aşağıdaki gibi bir return alırsınız;

```json
{
    "application_id":your applicationId,
    "organization_id":your organizationId,
    "role": "guest",
    "client_id": "1OPXgXRwjVtECiwJzNGMsH7V",
    "client_secret": "uW139pAbGxYbEC9gzAAXfriPoo2ESETyA9RtgIyMm9TLus6x"
}
```

Alınan bu veriyi authenticate işlemi için şöyle kullanmalıyız;

**Url:**

```html
https://your-serverip/auth/auth
```

```json
{
    "application_id":your applicationId,
    "organization_id":your organizationId,
    "role": "guest",
    "client_id": "1OPXgXRwjVtECiwJzNGMsH7V",
    "client_secret": "uW139pAbGxYbEC9gzAAXfriPoo2ESETyA9RtgIyMm9TLus6x"
}
```

Bu işlem sonucunda size token içeren aşağıdaki sonuç döndürülecektir;

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEwLCJjbGllbnRJZCI6IjYxYjdlMDQ4YTNiYjFmZWFjYTZlMTliNyIsInJvbGUiOiJhZG1pbiIsImFwcGxpY2F0aW9uSWQiOiJiZmYzMjlhMi1jYjEyLTQ4ODItYjc2MC1jZWJkYmUyYzIyMzYiLCJleHAiOjE2NDc5MDAxNjZ9.fCnC4B3kovK3fXDzBTQ6zBagZXGUNdqZzbqSmeUbF48",
    "expiresin": "3600"
}
```

Token süresi **default** olarak 1 saat olarak belirlenmiştir. Kurulum sırasında süreyi değiştirebilirsiniz.

Guest Token işlemi yapıldıktan sonra kullanıcı sorgulama işlemi sonucunda kullanıcının id'si alınır ve aynı işlemler client_id verisini de içerecek şekilde tekrarlanır.

Örnekleyelim;

Guest token ile birlikte kullanıcı sorgulama işlemi yapılmalı.

Bkz. [Get Collection](./#/getcollection)

İşlem sonucunda **id** verisi alınarak öncelikle client secret data oluşturma işlemi yapılmalı;

**Url:**

```html
https://your-serverip/auth/client
```

```json
{
    "client_id":id
    "application_id":your applicationId,
    "organization_id":your organizationId
}
```

İşlem sonucu alınan veriyi aşağıdaki şekilde authentication işlemi için kullanmalıyız.

**Url:**

```html
https://your-serverip/auth/auth
```

```json
{
    "application_id":your applicationId,
    "organization_id":your organizationId,
    "role": "user",
    "client_id": "1OPXgXRwjVtECiwJzNGMsH7V",
    "client_secret": "uW139pAbGxYbEC9gzAAXfriPoo2ESETyA9RtgIyMm9TLus6x"
}
```

Bu işlem sonucunda size aşağıdaki gibi token içeren veri döndürülecektir.

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEwLCJjbGllbnRJZCI6IjYxYjdlMDQ4YTNiYjFmZWFjYTZlMTliNyIsInJvbGUiOiJhZG1pbiIsImFwcGxpY2F0aW9uSWQiOiJiZmYzMjlhMi1jYjEyLTQ4ODItYjc2MC1jZWJkYmUyYzIyMzYiLCJleHAiOjE2NDc5MDAxNjZ9.fCnC4B3kovK3fXDzBTQ6zBagZXGUNdqZzbqSmeUbF48",
    "expiresin": "3600"
}
```

## **Not:**

*Yukarıda ki örnek için SDK'lar içerisinde Login yöntemi oluşturulmuştur. Tek yöntemi bir kere çağırmanız sonucunda size nihai işlem sonucu olan kullanıcı token verisi döndürülecektir.*

##