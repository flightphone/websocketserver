# websocketserver
<pre>
Push server on Node.js 
:8080 chat 
:8080/admin  - admin info 

На сервер посылается JSON строка произвольного объекта. 
Поля в объекте: 
{ type: "MessType", to: "address", from: "UserID"  ... } 

Возможные значения для поля type:
echo - сообщение отправляется обратно 
auth - авторизация на сервере. При аторизации нужно укзать поля: UserID - id 
пользователя, UserName - имя, UserGroup - группа. Значение полей UserID, UserName, UserGroup - можно использовать в поле to сообщения типа message. 
message - рассылка сообщений пользователям указанным в поле to сообщения. В поле from нужно указывать UserID
</pre>



