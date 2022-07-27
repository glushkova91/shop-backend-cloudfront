do $$
declare indexQ integer;
begin
	indexQ := 1;
   while indexQ < 30 loop
      insert into product
         (title, description, price)
      values ('Product' || indexQ, 'ProductDescription' || indexQ, indexQ);
     indexQ := indexQ + 1;
   end loop;
end$$;
