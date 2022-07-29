do $$
declare indexQ integer;
begin
	indexQ := 1;
   while indexQ < 10 loop
      with rows as (
      insert into product
         (title, description, price)
      values ('Product' || indexQ, 'ProductDescription' || indexQ, indexQ) returning id
     )
     insert into stocks (id) select id from rows;
    update stocks set count = 10;
     indexQ := indexQ + 1;
   end loop;
end$$;
