-- 라벨(스티커북 권) 추가. 1~6, 스티커북에 붙일 때 정해진다.
alter table public.stickers add column if not exists book_label int;

-- 라벨 이전에 붙인 스티커는 기본 라벨(4번) 책에 둔다
update public.stickers set book_label = 4 where book_page is not null and book_label is null;
