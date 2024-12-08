insert into filter_tag(id, name)
values (1, 'Kinder'),
       (2, 'Klimawandel'),
       (3, 'Artenschutz')
;

insert into question(question, image_url, tag)
values ('Magst du Kinder? Kinder sind laut Wikipedia Menschen vor der Phase der Adoleszenz',
        'static/question-images/kinder.jpg', 1),
       ('Ich sehe den Klimawandel als akutes Problem und möchte den Klimawandel bekämpfen',
        'static/question-images/klimawandel.png', 2),
       ('Die Artenvielfalt der Welt ist mir ein persönliches Anliegen', 'static/question-images/artenvielfalt.jpg', 3)
;