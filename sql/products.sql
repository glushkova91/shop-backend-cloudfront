declare @i int = 0
while @i < 5
begin
    set @i = @i + 1
    insert into product (title, description, price) values ('product' + @i, 'product' + @i + 'description', @i);
end
