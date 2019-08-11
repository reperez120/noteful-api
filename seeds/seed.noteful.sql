BEGIN;

TRUNCATE folders, notes RESTART IDENTITY CASCADE;

INSERT INTO folders
(folder_name)
VALUES
('Important'),
('Super'),
('Spangley');

INSERT INTO notes
(note_name, folder)
VALUES
('Dogs', 1),
('Cats', 2),
('Pigs', 2),
('Birds', 1),
('Bears', 1),
('Horses', 2),
('Tigers', 3),
('Wolves', 3),
('Elephants', 2),
('Lions', 1),
('Monkeys', 3),
('Bats', 1),
('Turtles', 2),
('Zebras', 2);

COMMIT;


