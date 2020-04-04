# websocketserver
<pre>
Push server on Node.js 
:7500 chat 
:7500/admin  - admin info 

На сервер посылается JSON строка произвольного объекта. 
Поля в объекте: 
{ type: <TYPE>, to: <TO>, from: <UserID>  ... } 

Возможные значения для поля type:
echo - сообщение отправляется обратно 
auth - авторизация на сервере. При аторизации нужно укзать поля: 
        UserID - id пользователя, 
        UserName - имя, 
        UserGroup - группа. Значение полей UserID, UserName, UserGroup 
        можно использовать в поле to сообщения типа message. 
message - рассылка сообщений пользователям указанным в поле to сообщения. 
        если указать строку 'all' сообщение отправляется всем пользователям.
        В поле from нужно указывать UserID
</pre>



