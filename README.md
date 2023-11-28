# <span href = "#contentsUa" id = "contentsUa">Wordpress</span>
____
Мій перший навчальний проект з HTML CSS, який я далі модифікував та розробив додатковий функціонал на JS.
Тут використовується "симуляція" поведінки серверу розкладу уроків та форма запису, яка взаємодіє з цією симуляцією, щоби створити приближений до реальності доствід запису на урок. Далі я буду розділяти опис "бекендової" частини коду та "фронтендової", але треба одразу зазначити, що усі дії у бекондовій частині, насправді фактично не є бекендом, а скоріше симуляцією, бо вона виконується на стороні клієнта і всі дані генеруються і зберігаються тільки у конкретній сесії відкритої вкладки браузеру, та після перезавантаження сторінки, всі дані про уроки та користувачів генеруються заново, бо вони не зберігаються на сервері у БД, або навіть у local storage сторінки. 
Також нижче можете розглянути <a href = "#contentsEn">англійську версію документації</a>.

- Українська версія
    - <a href = "#contentsUa">Опис</a>
    - <a href = "#backendUa">Backend</a>
        - <a href = "#userUa">User</a>
        - <a href = "#lessonUa">Lesson</a>
        - <a href = "#lessonTypeUa">LessonType</a>
        - <a href = "#timetableUa">Timetable</a>
        - <a href = "#additionalFooUa">Функції генерації розкладу</a>
    - <a href = "#frontendUa">Frontend</a>
        - <a href = "#mainUiFooUa">Основні функції</a>
        - <a href = "#mainEventListenersUa">Основні прослуховувачі подій</a>
- English version
    - <a href = "#contentsEn">Description</a>
    - <a href = "#backendEn">Backend</a>
        - <a href = "#userEn">User</a>
        - <a href = "#lessonEn">Lesson</a>
        - <a href = "#lessonTypeEn">LessonType</a>
        - <a href = "#timetableEn">Timetable</a>
        - <a href = "#additionalFooEn">Schedule generation functions</a>
    - <a href = "#frontendEn">Frontend</a>
        - <a href = "#mainUiFooEn">Main functions</a>
        - <a href = "#mainEventListenersEn">Main event listeners</a>

## <a id = "backendUa">Backend</a>
____
Backend складається з кількох чітких структур: Користувачі User, Уроки Lesson, типи уроків LessonType, Розклад уроків Timetable, та додаткові функції, які забезпечують "генерацію" уроків та користувачів. Кожен об'єкт User, Lesson, LessonType та Timetable створюються завдяки функціям конструкотам, які мають внутрішні перевірки на корректність данних, яких в них передали.
Давайте розглянемо основні компоненти, які приводять у життя цей проєкт:


### <span id = "userUa">User</span>
`User(id, userName, userEmail, userBookId)`

Створює об'єкт користувача із зазначеним ID, ім'ям користувача, електронною адресою та ID заброньованого уроку.

### <span id = "lessonUa">Lesson</span>
`Lesson(lessonId, lessonType, lessonTime, maxUsers)`

Створює об'єкт уроку із зазначеним ID, типом, часом та максимальною кількістю користувачів.


Методи:

`isFree(): boolean` - Перевіряє, чи є вільні місця на уроці.

`getFreeSlotsCount(): number` - Повертає кількість вільних слотів на уроці.

`getLessonId(): number` - Повертає ID уроку.

`getLessonType(): string` - Повертає тип уроку.

`getLessonTime(): Date` - Повертає дату та час уроку.

`addUser(user): void` - Додає користувача на урок, якщо є вільні місця.

### <span id = "lessonTypeUa">LessonType</span>
`LessonType(lessonType, title, message)`

Створює об'єкт типу уроку із зазначеним типом, назвою та повідомленням.

### <span id = "timetableUa">Timetable</span>

`Timetable(availableLessonTypes, allUsers, lessons)`

Створює об'єкт розкладу із доступними типами уроків, даними користувачів та уроками.

Методи:

`getAvailableLessonTypes(): array` - Повертає доступні типи уроків.

`getFreeLessons(): array` - Повертає усі вільні уроки в розкладі.

`getFreeLessonsByRange(minDate, maxDate): array` - Повертає вільні уроки в зазначеному діапазоні дат.

`getFreeLessonsOnDay(date, lessons): array` - Повертає вільні уроки на конкретний день.

`getFilteredFreeLessons(lessonType, dayDate): array` - Повертає вільні уроки певного типу на конкретний день.

`getLessonsByDate(date): array` - Повертає уроки на певну дату.

`bookLesson(user, lesson): boolean` - Бронює урок для користувача.

`addLesson(lesson): void` - Додає новий урок до розкладу.


### <span id = "additionalFooUa">Додаткові функції, які генерують та заповнюють розклад уроків випадковими користувачами</span>

`generateRandomString(minLength, maxLength)`: Генерує випадковий рядок довжиною від minLength до maxLength. Символи у рядку є буквено-цифровими.

`dateTimeCorrection(date)`: Коригує час заданої дати, встановлюючи години, хвилини, секунди та мілісекунди на нуль.

`generateRandomDateTime(minDate, maxDate, minHour, maxHour)`: Генерує випадкову дату та час в зазначеному діапазоні. Якщо діапазон не вказано, використовується наступний 30-денний період з робочим часом з 8:00 до 19:00.

`generateUserData()`: Генерує випадкові дані користувача, включаючи ім'я користувача та електронну адресу.

`generateLessonsByCount(count)`: Генерує вказану кількість уроків та додає їх до розкладу. За замовчуванням кількість становить 360.

`generateLessonsByDate(minDate, maxDate, minWorkHour, maxWorkHour)`: Генерує уроки в межах заданого діапазону дат, з урахуванням робочих годин. Робочий час за замовчуванням з 8:00 до 19:00.

`scheduleGeneration(density, minDate, maxDate)`: Генерує бронювання на основі відсоткової щільності в заданому діапазоні дат.

## <span id = "frontendUa">Frontend</span>
____
Фронтендова частина була написана на чистому JS з використанням HTML та CSS (SCSS). Для відображення, та взаємодією з календарем використовувалась бібліотека flatpickr, увесь інший функціонал був написаний мною особисто.

### <span id = "mainUiFooUa">Основні функції для взаємодії користувача з UI запису на урок</span>

`modalOpen(element, action)`: Відкриває модальне вікно з плавною зміною прозорості.

`modalClose(element, action)`: Закриває модальне вікно з плавною зміною прозорості.

`modalOpenClose(element, action)`: Відкриває або закриває модальне вікно в залежності від поточного стану.

`modalSwitchWindows(activeWindow, targetWindow)`: Перемикає між активним і цільовим вікнами.

`modalHideSwitchTo(modalWindow, targetWindow)`: Ховає поточне вікно і приховано перемикає на цільове.

`lessonTypeListFiller()`: Заповнює список типів уроків на основі доступних типів уроків з розкладу.

`showLessonTypeList(e)`: Показує список типів уроків.

`hideLessonTypeList(e)`: Ховає список типів уроків.

`updateCalendar(selectedLessonType)`: Оновлює календар в залежності від вибраного типу уроку.

`showCaledar(selectedLessonType)`: Показує календар для вибраного типу уроку.

`hideFreeHours()`: Ховає блок вибору годин.

`updateFreeHours(selectedLessonType, selectedDate)`: Оновлює список вільних годин для вибраного типу уроку та дати.

`showFreeHours(selectedLessonType, selectedDate)`: Показує блок вибору годин для вибраного типу уроку та дати.

`showUserForm()`: Показує форму користувача з іменем та імейлом.

`hideUserForm()`: Ховає форму користувача з іменем та імейлом.

`inputValidation(input)`: Валідація введених даних.

`showErrors(input, error)`: Показує повідомлення про помилку валідації.

`deleteError(input)`: Видаляє повідомлення про помилку валідації.

`resetBookWindow()`: Скидає стан вікна бронювання.


### <span id = "mainEventListenersUa">Основні прослуховувачі подій</span>

Відкриття вікна:
`openWindowBtns`: Використовується для прослуховування кліку на кнопки відкриття вікон. При кліку відбувається виклик modalOpenClose(windowManager).

Вибір типу уроку:
`lessonTypeSelected` та `lessonTypeListItems`: Прослуховуються події кліку на вибір типу уроку. Відбирається обраний тип уроку, викликаються функції для оновлення календаря та показу годин.

Введення та Валідація Імені та Email
`userNameInput`, `userEmailInput`, `policyCheckBox`: Прослуховуються події введення для імені, email та чекбокса політики. Викликаються функції валідації.

Клік на Кнопці Submit

`submitBtns`: Прослуховує клік на кнопці Submit. Викликає функцію для перевірки валідності введених даних та, у разі успіху, реєструє користувача за обраним уроком.

Клік на Кнопці Close

`windowCloseBtns`: Прослуховуються кліки на кнопках закриття вікон. Викликаються функції для закриття відповідних вікон та повернення до головного вікна.

Наведення на Елементи вибору Типу Уроку

`lessonTypeListItems`: Прослуховуються події наведення курсору миші на елементи вибору типу уроку. Коли користувач наводить мишу на елемент списку з типів уроків - виводиться додаткова іформація про курс.

Зміна Параметрів Календаря

`calendarElem`: Спостерігається за зміною обраних параметрів календаря, таких як дата. Коли користувач вибирає нову дату, викликається відповідна функція для оновлення вільних годин уроків для обраного типу уроку.

Клік на Виборі Години Уроку

`freeHoursList`: Прослуховується клік на годинах уроку. Коли користувач обирає конкретну годину, показується форма для введення даних користувача.


# <span id="contentsEn">Wordpress</span>
____
My first learning project with HTML CSS, which I later modified and developed additional functionality in JS. Here, a "simulation" of the lesson schedule server behavior and a registration form are used, which interacts with this simulation to create an experience close to the reality of lesson registration. Later, I will separate the description of the "backend" and "frontend" parts of the code, but it should be noted immediately that all actions in the backend part are not actually backend, but rather a simulation because it is performed on the client side, and all data is generated and stored only in a specific session of the open browser tab. After reloading the page, all data about lessons and users is generated again because it is not stored on the server in the database or even in the local storage of the page.


## <span id="backendEn">Backend</span>
____
The backend consists of several clear structures: Users, Lessons, Lesson types, Lesson Schedule, and additional functions that provide the "generation" of lessons and users. Each User, Lesson, Lesson Type, and Timetable object is created thanks to constructor functions that have internal checks for the correctness of the data passed to them.
Let's consider the main components that bring this project to life:

### <span id="userEn">User</span>
`User(id, userName, userEmail, userBookId)`

Creates a user object with a specified ID, username, email, and the ID of the booked lesson.

### <span id="lessonEn">Lesson</span>
`Lesson(lessonId, lessonType, lessonTime, maxUsers)`

Creates a lesson object with a specified ID, type, time, and maximum number of users.

Methods:

`isFree(): boolean` - Checks if there are available slots on the lesson.

`getFreeSlotsCount(): number` - Returns the number of available slots on the lesson.

`getLessonId(): number` - Returns the ID of the lesson.

`getLessonType(): string` - Returns the type of the lesson.

`getLessonTime(): Date` - Returns the date and time of the lesson.

`addUser(user): void` - Adds a user to the lesson if there are available slots.

### <span id="lessonTypeEn">LessonType</span>

`LessonType(lessonType, title, message)`

Creates a lesson type object with a specified type, title, and message.

### <span id="timetableEn">Timetable</span>

`Timetable(availableLessonTypes, allUsers, lessons)`

Creates a timetable object with available lesson types, user data, and lessons.

Methods:

`getAvailableLessonTypes(): array` - Returns available lesson types.

`getFreeLessons(): array` - Returns all free lessons in the schedule.

`getFreeLessonsByRange(minDate, maxDate): array` - Returns free lessons within the specified date range.

`getFreeLessonsOnDay(date, lessons): array` - Returns free lessons on a specific day.

`getFilteredFreeLessons(lessonType, dayDate): array` - Returns free lessons of a specific type on a specific day.

`getLessonsByDate(date): array` - Returns lessons for a specific date.

`bookLesson(user, lesson): boolean` - Books a lesson for a user.

`addLesson(lesson): void` - Adds a new lesson to the schedule.


### <span id="additionalFooEn">Additional functions that generate and fill lesson schedule with random users</span>

`generateRandomString(minLength, maxLength)`: Generates a random string with a length between minLength and maxLength. The characters in the string are alphanumeric.

`dateTimeCorrection(date)`: Corrects the time of the given date by setting hours, minutes, seconds, and milliseconds to zero.

`generateRandomDateTime(minDate, maxDate, minHour, maxHour)`: Generates a random date and time within the specified range. If no range is provided, it uses the next 30 days with working hours from 8:00 to 19:00.

`generateUserData()`: Generates random user data, including a username and email.

`generateLessonsByCount(count)`: Generates the specified number of lessons and adds them to the schedule. The default count is 360.

`generateLessonsByDate(minDate, maxDate, minWorkHour, maxWorkHour)`: Generates lessons within the specified date range, considering working hours. The default working hours are from 8:00 to 19:00.

`scheduleGeneration(density, minDate, maxDate)`: Generates bookings based on the percentage density within the specified date range.

## <span id="frontendEn">Frontend</span>
____
The frontend part was written in pure JS using HTML and CSS (SCSS). The library flatpickr was employed for displaying and interacting with the calendar, while all other functionality was personally implemented.

### <span id="mainUiFooEn">Key functions for user interaction with the lesson booking UI</span>

`modalOpen(element, action)`: Opens a modal window with a smooth opacity transition.

`modalClose(element, action)`: Closes a modal window with a smooth opacity transition.

`modalOpenClose(element, action)`: Opens or closes a modal window depending on the current state.

`modalSwitchWindows(activeWindow, targetWindow)`: Switches between the active and target windows.

`modalHideSwitchTo(modalWindow, targetWindow)`: Hides the current window and discreetly switches to the target window.

`lessonTypeListFiller()`: Populates the list of lesson types based on the available types from the timetable.

`showLessonTypeList(e)`: Displays the list of lesson types.

`hideLessonTypeList(e)`: Hides the list of lesson types.

`updateCalendar(selectedLessonType)`: Updates the calendar based on the selected lesson type.

`showCaledar(selectedLessonType)`: Displays the calendar for the selected lesson type.

`hideFreeHours()`: Hides the block for selecting hours.

`updateFreeHours(selectedLessonType, selectedDate)`: Updates the list of available hours for the selected lesson type and date.

`showFreeHours(selectedLessonType, selectedDate)`: Displays the block for selecting hours for the selected lesson type and date.

`showUserForm()`: Displays the user form with name and email fields.

`hideUserForm()`: Hides the user form with name and email fields.

`inputValidation(input)`: Validates the entered data.

`showErrors(input, error)`: Displays validation error messages.

`deleteError(input)`: Removes validation error messages.

`resetBookWindow()`: Resets the state of the booking window.


### <span id="mainEventListenersEn">Main event listeners</span>

Opening Windows:

`openWindowBtns`: Listens for clicks on window opening buttons. When clicked, calls modalOpenClose(windowManager).

Lesson Type Selection:

`lessonTypeSelected` and `lessonTypeListItems`: Listen for click events on lesson type selection. Selects the chosen lesson type and calls functions to update the calendar and show available hours.

Name and Email Input and Validation:

`userNameInput`, `userEmailInput`, `policyCheckBox`: Listen for input events for name, email, and policy checkbox. Calls validation functions.

Click on Submit Button:

`submitBtns`: Listens for clicks on the Submit button. Calls a function to check the validity of entered data and, if successful, registers the user for the selected lesson.

Click on Close Button:

`windowCloseBtns`: Listen for clicks on window close buttons. Calls functions to close the respective windows and return to the main window.

Hover on Lesson Type Selection Items:

`lessonTypeListItems`: Listens for mouse hover events on lesson type selection items. When the user hovers over an item in the lesson type list, additional information about the course is displayed.

Change of Calendar Parameters:

`calendarElem`: Observes changes in selected calendar parameters, such as date. When the user selects a new date, the corresponding function is called to update the available lesson hours for the selected lesson type.

Click on Lesson Hour Selection:

`freeHoursList`: Listens for clicks on lesson hours. When the user selects a specific hour, a form for entering user data is displayed.
