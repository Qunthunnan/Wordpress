window.addEventListener('DOMContentLoaded', () => {

    // Відкривається віндов (дропдаун - оберіть тип курсу; день, коли зручно(календарик, де можна обрати дні, починаючи з сьогодні, бажано - з маркуванням днів, де є вільні слоти); в залежності від обраного дня, виводить вільні слоти у форматі '11:00', '12:00' (час за києвом), можна обрати тільки один; ім'я, електрона пошта, (поля можна спробувати виводити чергово, один за одним) - записатись
    //      чи усі поля пройшли валідацію(треба також перевіряти, чи записаний користувач вже по пошті)
    //              Закриваємо вікно з букінгом, відкриваємо вікно-записали, але залишаємо кнопку, записати ще одного користувача. Закриваємо, відкриваємо знову вікно? (перевірка, чи записаний користувач?)
    //              Виводимо те саме, вікно, тільки трішки коригуємо текст що користучач вже записаний, посилання на урок він може подивитись у листі. Користувач натискає записати ще користувача
    //                      Робимо свіч вікна на запис на курс, щоби дати записати нового користувача
    //
    //      на полях, що не пройшли валідацію виводити помилки(не обран тип курсу, не обран зручний день, не обран часовий слот, не правильно ввели пошту, користувач вже записаний, хай перевірить пошту)
    //
    //
    //Структура даних
    //      Розклад уроків - це об'єкт, де лежить масив уроків(конкретна реалізація ще продумується), список усіх записаних користувачів, кожен урок це об'єкт з часовою id, типом уроку, масивом користувачів, записаних на вебінар, максимальна кількість користувачів, кількість користувачів - це length масиву користувачів; Методи уроку: чи є вільні місця, записати користувача, видалити запис користувача; Методи розкладу: повернути уроки з вільними місцями для запису, записати користувача на конкретний урок, чи зареєстрований вже десь користувач;
    //Кожен користувач - це об'єкт з ім'ям, поштою, за часовим id запису на заняття
    //
    //що зберігається на фронті - чи записався вже користувач
    //  


    //backend simulation

    function generateRandomString(minLength, maxLength) {
        let length = 0;
        if(maxLength) {
            do {
                length = Math.floor(Math.random()*10);
            } while(length < minLength || length > maxLength)
        } else {
            length = minLength;
        }
        
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
    
        return result;
    }

    function dateTimeCorrection(date) {
        date.setHours(date.getDate())
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }

    function generateRandomDateTime(minDate, maxDate, minHour, maxHour) {
        let currentDate = new Date();
        try {
            if(minDate.getTime()) {
                currentDate = new Date(minDate);
            }
        } catch (error) {
            
        } // Мінімальна дата, якщо не вказана, то від зараз)
        
        let days = 30;
        try {
            if(maxDate.getTime()) {
                days = new Date(maxDate.getTime() - currentDate.getTime()).getTime() / 1000 / 60 / 60 / 24;
            }
        } catch (error) {
        }

        if(!minHour && minHour != 0) {
            minHour = 8;
        }

        if(!maxHour && maxHour != 0) {
            maxHour = 19;
        }
         
        var randomDays = Math.floor(Math.random() * days); // Випадкова кількість днів в межах 0-days
        var randomHours = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour; // Випадкова кількість годин в межах 8-19
        var futureDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000); // Формуємо сгенеровану дату через поточну дату + згенерована кількість днів*24години*60хв*60сек*1000мс (маніпулуємо по факту міллісекундами)
        futureDate.setHours(randomHours, 0, 0, 0); // Встановлюємо згенеровану рандомного годину, 0хв:0сек:0мс
    
        return futureDate;
    }

    function generateUserData() {
        let userName = generateRandomString(3, 10);
        let userEmail = `${generateRandomString(5, 10)}@mail.com`;

        return [userName, userEmail];
    }

    function generateLessonsByCount(count) {
        if(!count) {
            count = 360;
        }
        let curDate = new Date();
        let genDate = new Date(curDate.getTime() + 1 * 60 * 60 * 1000);
        const minWorkHour = 8,
              maxWorkHour = 19;
        genDate.setMinutes(0, 0, 0);
        for(let i = 0; i < count; i++) {
            if(genDate.getHours() <= maxWorkHour && genDate.getHours() >= minWorkHour) {
                timetable.addLesson(timetable.availableLessonTypes[Math.floor(Math.random() * (2 - 0 + 1)) + 0].lessonType, genDate);
            } else {
                i--;
            }
            genDate.setTime(genDate.getTime()+ 1 * 60 * 60 * 1000);
        }
    }

    function generateLessonsByDate(minDate, maxDate, minWorkHour, maxWorkHour) {
        try {
            minDate.getDate();
            maxDate.getDate();
            if(!minWorkHour && minWorkHour != 0 || minWorkHour < 0 || typeof(minWorkHour) != 'number' || Math.floor(minWorkHour) != minWorkHour) {
                minWorkHour = 8;
            }

            if(!maxWorkHour || maxWorkHour < 0 || typeof(maxWorkHour) != 'number' || Math.floor(maxWorkHour) != maxWorkHour) {
                maxWorkHour = 19;
            }
            
            genDate = new Date(new Date(minDate.getTime() + 1 * 60 * 60 * 1000).setMinutes(0, 0, 0));
            
            while(genDate.getTime() >= minDate.getTime() && genDate.getTime() <= maxDate.getTime()) {
                if(genDate.getHours() >= minWorkHour && genDate.getHours() <= maxWorkHour) {
                    timetable.addLesson(timetable.availableLessonTypes[Math.floor(Math.random() * timetable.availableLessonTypes.length)].lessonType, genDate);
                }
                genDate = new Date(new Date(genDate.getTime() + 1 * 60 * 60 * 1000));
            }
        } catch (error) {
            console.log('Icorrect min or max date');
        }
    }

    function scheduleGeneration(density, minDate, maxDate) {
        let getFreeLessonsMethod;
        if(!density || density > 100 || density < 1 || Math.floor(density) != density) {
            density = 50;
        }
        let bookTargetCount = 0;
        try {
            minDate.getDate();
            maxDate.getDate();
            getFreeLessonsMethod = (minDate, maxDate) => {
                let result = timetable.getFreeLessonsByRange(minDate, maxDate);
                return result;
            }
        } catch (error) {
            getFreeLessonsMethod = () => {let result = timetable.getFreeLessons(); return result};
        }
        
        curentFreeLessons = getFreeLessonsMethod(minDate, maxDate);
        for(let i in curentFreeLessons) {
            bookTargetCount += curentFreeLessons[i].getFreeSlotsCount();
        }

        bookTargetCount *= density/100;
        bookTargetCount = Math.floor(bookTargetCount);

        for(let i = 0; i < bookTargetCount; i++) {
            let randFreeLessonId = getFreeLessonsMethod(minDate, maxDate)[Math.floor(Math.random() * (getFreeLessonsMethod(minDate, maxDate).length))].id;
            timetable.bookUser(...generateUserData(), randFreeLessonId);
        }
    }

    function User (id, userName, userEmail, userBookId) {

        if(typeof(id) == 'number' && id >= 0 && Math.round(id) == id) {
            this.id = id;
        } else { 
            console.log('User id is wrong');
            return undefined;
        }

        if(userName) {
            this.userName = userName;
        } else {
            console.log('Name is not defined');
            return undefined;
        }

        if(userEmail) {
            this.userEmail = userEmail;
        } else {
            console.log('Email is not defined');
            return undefined;
        }

        if(typeof(userBookId) == 'number' && userBookId >= 0 && Math.round(userBookId) == userBookId) {
            this.userBookId = userBookId;
        } else { 
            console.log('Lesson id is wrong');
            return undefined;
        }
    }

    function Lesson (lessonId, lessonType, lessonTime, maxUsers) {
        if(typeof(lessonId) == 'number' && lessonId >= 0 && Math.round(lessonId) == lessonId) {
            this.id = lessonId;
        } else { 
            console.log('Lesson id is wrong');
            return undefined;
        }

        if(lessonType) {
            this.lessonType = lessonType;
        } else {
            console.log('lesson type is empty');
            return undefined;
        }
        
        try {
            if(lessonTime.getDate()) {
                this.lessonTime = new Date(lessonTime);
            }
        } catch (error) {
            console.log('lessonTime is empty or corrupted');
            return undefined;
        }

        if(maxUsers && typeof(maxUsers) == 'number' && Math.round(maxUsers) == maxUsers && maxUsers > 0) {
            this.maxUsers = maxUsers;
        } else {
            this.maxUsers = 20;
        }

        this.lessonUsers = [];

        this.isFree = function () {
            if(this.lessonUsers.length < this.maxUsers) {
                return true;
            } else {
                return false;
            }
        }

        this.getFreeSlotsCount = function () {
            return this.maxUsers - this.lessonUsers.length;
        }

        this.getLessonId = function() {
            return this.id;
        }

        this.getLessonType = function () {
            return this.lessonType;
        }

        this.getLessonTime = function () {
            return this.lessonTime;
        }

        this.addUser = function (user) {
            try {
                if(user.userName) {
                    if(this.isFree()) {
                        this.lessonUsers.push(user);
                    } else {
                        console.log(`Lesson ${this.lessonTime} is full`);
                    }
                }
            } catch (error) {
                console.log('User data is broken');
            }
        }
    }

    function LessonType (lessonType, title, message) {
        if (lessonType && typeof(lessonType) === 'string') {
            this.lessonType = lessonType;
        } else {
            console.log('LessonType is wrong or empty. Allowed type for lessons - string');
            return undefined;
        }

        if (title && typeof(title) === 'string') {
            this.title = title;
        } else {
            console.log('Lesson type title is wrong or empty. Allowed type for title - string');
            return undefined;
        }

        if (message && typeof(message) === 'string') {
            this.message = message;
        } else {
            console.log('Lesson type message is wrong or emty. Allowed type for message - string');
        }
    }

    function Timetable (availableLessonTypes, allUsers, lessons) {

        this.availableLessonTypes = [];
        try {
            if(typeof(availableLessonTypes[0].lessonType) === 'string') {
                for(let i in availableLessonTypes) {
                    this.availableLessonTypes.push(availableLessonTypes[i]);
                }
            } else {
                this.availableLessonTypes.push(new LessonType('junior', 'WordPress Junior', 'Підійде для новачків у сфері без досвіду у програмуванні. Усьому навчимо з нуля.'));
                this.availableLessonTypes.push(new LessonType('middle', 'WordPress Middle', 'Підійде тим, хто має певний досвід. Починав навчатись, але не впевнений ще у своїх знаннях, хоче підтягнути їх.'));
                this.availableLessonTypes.push(new LessonType('senior', 'WordPress Senior', "Підійде тим, хто вже має комерційний досвід у сфері, але відчуває, що йому не достатньо знань для зросту у кар'єрі."));
            }
        } catch (error) {
            this.availableLessonTypes.push(new LessonType('junior', 'WordPress Junior', 'Підійде для новачків у сфері без досвіду у програмуванні. Усьому навчимо з нуля.'));
            this.availableLessonTypes.push(new LessonType('middle', 'WordPress Middle', 'Підійде тим, хто має певний досвід. Починав навчатись, але не впевнений ще у своїх знаннях, хоче підтягнути їх.'));
            this.availableLessonTypes.push(new LessonType('senior', 'WordPress Senior', "Підійде тим, хто вже має комерційний досвід у сфері, але відчуває, що йому не достатньо знань для зросту у кар'єрі."));
        }
 
        try {
            if(allUsers[0].userName) {
                for(let i in allUsers) {
                    this.allUsers.push(allUsers[i]);
                }
            }
        } catch (error) {
            this.allUsers = [];
        }

        try {
            lessons[0].isFree();
            for(let i in lessons) {
                this.lessons.push(allUsers[i]);
            }
        } catch (error) {
            this.lessons = [];
        }

        this.getAvailableLessonTypes = function () {
            return this.availableLessonTypes;
        }

        this.getFreeLessons = function () {
            let result = [];
            for(let i in this.lessons) {
                if(this.lessons[i].isFree()) {
                    result.push(this.lessons[i]);
                }
            }
            return result;
        }

        this.getFreeLessonsByRange = function (minDate, maxDate) {
            let result = [];
            try {
                minDate.getDate();
            } catch (error) {
                minDate = new Date();
            }
            try {
                maxDate.getDate();
            } catch {
                maxDate = minDate.fp_incr(30);
            }

            for(let i in this.lessons) {
                if(this.lessons[i].lessonTime.getTime() >= minDate.getTime() && this.lessons[i].lessonTime.getTime() <= maxDate.getTime() && this.lessons[i].isFree()) {
                    result.push(this.lessons[i]);
                }
            }
            return result;
        }

        this.getFreeLessonsOnDay = function(date, lessons) {
            let result = [];
            try {
                if(date.getDate()) {
                    let freeLessons = [];
                    try {
                        lessons[0].lessonTime.getDate();
                        for(let i in lessons) {
                            freeLessons.push(lessons[i]); 
                        }
                    } catch (error) {
                        for(let i in this.getFreeLessons()) {
                            freeLessons.push(this.getFreeLessons()[i]);
                        }
                        
                    }

                    for(let i in freeLessons) {
                        if(freeLessons[i].lessonTime.getDate() == date.getDate() && freeLessons[i].lessonTime.getMonth() == date.getMonth() && freeLessons[i].lessonTime.getFullYear() == date.getFullYear()) {
                            result.push(freeLessons[i]);
                        }
                    }
                    return result;
                }
            } catch (error) {
                console.log('iccorrect Date');
                return undefined;
            }
        }

        this.getFilteredFreeLessons = function (lessonType, dayDate) {
            let typeCheck;
            for(let i in this.availableLessonTypes) {
                if(lessonType == this.availableLessonTypes[i].lessonType) {
                    typeCheck = true;
                    break;
                }
            }

            if(typeCheck) {
                let result = [];

                for(let i in this.lessons) {
                    if(this.lessons[i].lessonType == lessonType && this.lessons[i].isFree()) {
                        result.push(this.lessons[i]);
                    }
                }

                try {
                    dayDate.getDate();

                    return this.getFreeLessonsOnDay(dayDate, result);

                } catch (error) {
                    return result;
                }
                
            } else {
                console.log(`lessonType is not recognized, try first .addNewLessonType(\'${lessonType}\');`);
            }
        }

        this.getLessonsByDate = function(date) {
            try {
                if(date.getDate()) {
                    let result = [];
                    for(let i in this.lessons) {
                        if(this.lessons[i].lessonTime = date) {
                            result.push(this.lessons[i]);
                        }
                    }
                }                 
            } catch (error) {
                console.log('iccorrect Date');
                return undefined;
            }
        }
        
        this.isRegistered = function(user) {
            try {
                if(user.userName) {
                    for(let i in this.allUsers) {
                        if(user.email == this.allUsers[i].email) {
                            return this.allUsers[i].id;
                        }
                    }
                    return false;
                }
            } catch (error) {
                console.log('User Data is corrupted');
            }
        }

        this.isExistsLesson = function (lessonId) {
                if(typeof(lessonId) == 'number' && lessonId >= 0 && Math.round(lessonId) == lessonId) {
                    if(this.lessons[lessonId]) {
                        return true;
                    } else {
                        console.log('Lesson not founded by lesson Id');
                        return false;
                    }
                }
                console.log('Lesson Id is icorrect');
                return false;
        }

        this.bookUser = function (userName, userEmail, lessonId) {
            let userAnswer = new User(this.allUsers.length, userName, userEmail, lessonId);
            try {
                if(userAnswer.userEmail) {
                    if(this.isExistsLesson(lessonId)) {
                        if(this.lessons[lessonId].isFree()) {
                            let checkUserReg = this.isRegistered(userAnswer);
                            if(!checkUserReg) {
                                this.allUsers.push(userAnswer);
                                this.lessons[lessonId].addUser(userAnswer);
                            } else {
                                console.log(`This user${this.allUsers[checkUserReg]} is already registered on the lesson ${this.lessons[lessonId]}`);
                            }
    
                        } else {
                            console.log(`Lesson ${this.lessons[lessonId]} is full`);
                        }
                    }
                }
            } catch (error) {
                
            }
        }

        this.addLesson = function (lessonType, lessonTime, maxUsers) {
            let result = new Lesson(this.lessons.length, lessonType, lessonTime, maxUsers);
            try {
                result.isFree();
                this.lessons.push(result);
            } catch (error) {
                
            }
        }

        this.addNewLessonType = function (lessonTypeObj) {
            try {
                if(typeof(lessonTypeObj.lessonType) === 'string') {
                    this.availableLessonTypes.push(lessonTypeObj);
                } else {
                    console.log('Wrong type of lesson type. Allowed type for lessons - string');
                }
            } catch (error) {
                console.log('Lesson type is icorrect');
            }   
        }
    }

    const timetable = new Timetable();
    
    let minDate = new Date(),
        weekDate = new Date(new Date().fp_incr(6).setHours(23,59,59,999)),
        weekDate2 = new Date().fp_incr(7),
        monthDate = new Date(new Date().fp_incr(30).setHours(23,59,59,999));

    generateLessonsByDate(minDate, monthDate);
    scheduleGeneration(99, minDate, weekDate);
    scheduleGeneration(80, weekDate2, monthDate);

    for (let i in timetable.lessons) {
        console.log(`${timetable.lessons[i].lessonTime} ${timetable.lessons[i].lessonType}: ${timetable.lessons[i].lessonUsers.length} / ${timetable.lessons[i].maxUsers}`);
    }

    console.dir(timetable);

    //frontend

    function findTrueParentElemByClass(eventElement, parentClass) {
        try {
            if(eventElement.parentNode.className == parentClass) {
                return eventElement.parentNode;
            } else {
                findTrueParentElemByClass(eventElement.parentNode, parentClass);
            }
        } catch (error) {
            return undefined;
        }
    }

    function lessonTypeListFiller () {
        let lessonTypes = [];
        for(let i in timetable.getAvailableLessonTypes()) {
            lessonTypes.push(timetable.getAvailableLessonTypes()[i]);
        } 
        
        for(let i in lessonTypes) {
            let listItemElement = document.createElement('li');
            listItemElement.className = 'window-manager__window__lesson-type__item';
            listItemElement.setAttribute('data-course-type', lessonTypes[i].lessonType);
            let itemTitleElement = document.createElement('div');
            itemTitleElement.className = 'window-manager__window__lesson-type__title';
            itemTitleElement.innerText = `${lessonTypes[i].title}`;
            listItemElement.append(itemTitleElement);
            let itemMessageElement = document.createElement('div');
            itemMessageElement.className = 'window-manager__window__lesson-type__message';
            itemMessageElement.innerText = `${lessonTypes[i].message}`;
            listItemElement.append(itemMessageElement);
            lessonTypeSelectList.append(listItemElement);
        }
        lessonTypeListItems = windowManager.querySelectorAll('.window-manager__window__lesson-type__item');
        lessonTypeListMessages = windowManager.querySelectorAll('.window-manager__window__lesson-type__message');
    }

    function showLessonTypeList (e) {
        lessonTypeSelectList.style.display = 'block';
    }

    function hideLessonTypeList (e) {
        isOpenedList = false;
        lessonTypeSelectList.style.display = 'none';
        document.removeEventListener('click', hideLessonTypeList);
    }

    function updateCalendar (selectedLessonType) {
        debugger;
        let freeDays = []; 
        for(let i in timetable.getFilteredFreeLessons(selectedLessonType)) {
            freeDays.push(timetable.getFilteredFreeLessons(selectedLessonType)[i].lessonTime);
        }
        calendar = flatpickr(calendarElem, {
            "locale": "uk",
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "Y-m-d",
            minDate: 'today',
            maxDate: new Date().fp_incr(30),
            enable: freeDays,
        });

        calendar.config.onChange.push(function(selectedDates) {
            selectedDate = selectedDates[0];
            if(!isSelectedDate) {
                isSelectedDate = true;
                showFreeHours(selectedLessonType, selectedDate);
            } else {
                updateFreeHours(selectedLessonType, selectedDate);
            }
         } );

         if(isSelectedDate) {
            updateFreeHours(selectedLessonType, selectedDate);
         }
    }
 
    function showCaledar (selectedLessonType) {
        debugger;
        isShowedCalendar = true;
        calendarBlock.classList.add('window-manager__window__choose-day_active');
        updateCalendar(selectedLessonType);
    }

    function hideFreeHours () {
        debugger;
        freeHoursBlock.classList.remove('window-manager__window__choose-time_active');
        selectedDate = undefined;
        isSelectedDate = false;
        calendar.value = '';
    }

    function updateFreeHours (selectedLessonType, selectedDate) {
        debugger;
        if(isSelectedLessonId) {
            isSelectedLessonId = false;
            selectedLessonId = undefined;
            hideUserForm();
        }
        let freeLessons = [];
        start: for(let i in timetable.getFilteredFreeLessons(selectedLessonType, selectedDate)) {
                    for(let k in freeLessons) {
                        if(freeLessons[k].lessonTime.getHours() === timetable.getFilteredFreeLessons(selectedLessonType, selectedDate)[i].lessonTime.getHours()) {
                            continue start;
                        }
                    }
                    freeLessons.push(timetable.getFilteredFreeLessons(selectedLessonType, selectedDate)[i]);
                }
        if(freeLessons.length >  0) {
            freeHoursList.innerHTML = '';
            for(let i in freeLessons) {
                let freHourItem = document.createElement('li');
                    freHourItem.setAttribute('data-lessonid', `${freeLessons[i].id}`);
                    if(`${freeLessons[i].lessonTime.getMinutes()}`.length > 1) {
                        freHourItem.innerText = `${freeLessons[i].lessonTime.getHours()}:${freeLessons[i].lessonTime.getMinutes()}`;
                    } else {
                        freHourItem.innerText = `${freeLessons[i].lessonTime.getHours()}:0${freeLessons[i].lessonTime.getMinutes()}`;
                    }
                    freHourItem.addEventListener('click', (e)=>{
                        timeChoose(e);
                    });
                    freeHoursList.append(freHourItem);
            }
        } else {
            hideFreeHours();
        }

    }

    function showFreeHours (selectedLessonType, selectedDate) {
        debugger;
        freeHoursBlock.classList.add('window-manager__window__choose-time_active');
        updateFreeHours(selectedLessonType, selectedDate);
    }

    function timeChoose (e) {
        debugger;
        if(!isSelectedLessonId) {
            isSelectedLessonId = true;
            showUserForm();
        } else {
            e.target.parentNode.querySelector(`[data-lessonid="${selectedLessonId}"]`).classList.remove(`active`);
        }
        e.target.classList.add('active');
        selectedLessonId = +e.target.getAttribute('data-lessonid');
        console.log(selectedLessonId);
    }

    function showUserForm () {
        debugger;
        userFormBlocksList.forEach((element)=>{
            element.classList.add(`${element.className}_active`);
        });
    }

    function hideUserForm () {
        debugger;
        for (let i = userFormBlocksList.length-1; i >= 0; i--) {
            userFormBlocksList[i].classList.remove(`${userFormBlocksList[i].classList[0]}_active`);
        }
    }


    const windowManager = document.querySelector('.window-manager');
    let lessonTypeSelectList = windowManager.querySelector('.window-manager__window__lesson-type__list'),
        lessonTypeSelected = windowManager.querySelector('.window-manager__window__lesson-type-selected'),
        calendarBlock = windowManager.querySelector('.window-manager__window__choose-day'),
        calendarElem = windowManager.querySelector('#calendar'),
        freeHoursBlock = windowManager.querySelector('.window-manager__window__choose-time'),
        freeHoursList = windowManager.querySelector('.window-manager__window__choose-time__list'),
        userNameBlock = windowManager.querySelector('.window-manager__window__name'),
        userEmailBlock = windowManager.querySelector('.window-manager__window__email'),
        userSubmitBlock = windowManager.querySelector('.window-manager__window__submit'),
        userPolicyBlock = windowManager.querySelector('.window-manager__window__policy'),
        userFormBlocksList = [userNameBlock, userEmailBlock, userSubmitBlock, userPolicyBlock],
        calendar = flatpickr(calendarElem, {
            "locale": "uk",
            altInput: true,
            altFormat: "j F, Y",
            dateFormat: "Y-m-d",
            minDate: 'today',
            maxDate: new Date().fp_incr(30),
        }),
        isOpenedList = false,
        isShowedCalendar = false,
        isSelectedDate = false,
        isSelectedLessonId = false,
        selectedDate,
        selectedLessonId,
        lessonTypeListItems,
        selectedLessonType = '';

    lessonTypeListFiller();

    lessonTypeSelected.addEventListener('click', (e) => {
        showLessonTypeList(e);
        if(isOpenedList) {
            isOpenedList = false;
            lessonTypeSelectList.style.display = 'none';
        } else {
            isOpenedList = true;
            document.addEventListener('click', (e)=>{
                if(e.target.className != lessonTypeSelected.className) {
                    hideLessonTypeList(e);
                }
            });
        }
    });

    //lesson type drop down
    lessonTypeListItems.forEach((element) => {
        element.addEventListener('mouseenter', (e) => {
            if(e.target.parentNode.className != 'window-manager__window__lesson-type__item') {
                e.target.querySelector('.window-manager__window__lesson-type__message').classList.toggle('window-manager__window__lesson-type__message_active');
            }
        });

        element.addEventListener('mouseleave', (e) => {
            if(e.target.parentNode.className != 'window-manager__window__lesson-type__item') {
                e.target.querySelector('.window-manager__window__lesson-type__message').classList.toggle('window-manager__window__lesson-type__message_active');
            }
        });

        element.addEventListener('click', (e) => {
            let targetElement;
            if(e.target.className === 'window-manager__window__lesson-type__item') {
                targetElement = e.target;
            } else {
                targetElement = e.target.parentNode;
            }

            targetElement.parentNode.parentNode.querySelector('.window-manager__window__lesson-type-selected').innerText = targetElement.querySelector('.window-manager__window__lesson-type__title').innerText;
            selectedLessonType = targetElement.getAttribute('data-course-type');
            //calendar
            debugger;
            if(isShowedCalendar) {
                updateCalendar(selectedLessonType);
            } else {
                showCaledar(selectedLessonType);
            }
        });
    });

    //calendar

// Ініціалізація Vue 3.x та VeeValidate 4.x
    const app = Vue.createApp({
        data() {
        return {
            name: '',
            email: ''
        };
        },
        setup() {
        // Використання VeeValidate у Vue 3.x
        const { validate, errors } = VeeValidate();
    
        // Реєстрація правил валідації
        validate('required', (value) => {
            return {
            valid: value && value.trim() !== '',
            message: 'Це поле обов\'язкове'
            };
        });
    
        validate('email', (value) => {
            const emailRegex = /\S+@\S+\.\S+/;
            return {
            valid: emailRegex.test(value),
            message: 'Введіть коректну адресу електронної пошти'
            };
        });
    
        return { validate, errors };
        },
        methods: {
        submitForm() {
            // Перевірка наявності помилок перед відправленням форми
            this.validate().then((result) => {
            if (result) {
                // Якщо форма валідна, виконайте відповідні дії (наприклад, відправлення на сервер)
                console.log('Форма валідна. Відправлення на сервер:', this.name, this.email);
            } else {
                // Якщо форма не валідна, обробте помилки
                console.log('Форма не валідна. Виправте помилки.');
            }
            });
        }
        }
    });
    
    app.use(VeeValidate);
    app.mount('#app');


    // scroll
    function scroll(item) {
        $(item).click(function(){
            const _href = $(item).attr("href");
            $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
            return false;
        });
    }

    scroll($("a[href=#waiting]"));
})