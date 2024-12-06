insert into filter_tag(id, name)
values (1, 'Kinder'),
       (2, 'Klimawandel'),
       (3, 'Artenschutz')
;

insert into frage(frage, tag)
values ('Magst du Kinder? Kinder sind laut Wikipedia Menschen vor der Phase der Adoleszenz', 1),
       ('Ich sehe den Klimawandel als akutes Problem und möchte den Klimawandel bekämpfen', 2),
       ('Die Artenvielfalt der Welt ist mir ein persönliches Anliegen', 3)
;