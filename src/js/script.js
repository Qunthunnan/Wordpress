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

    function generateLessons(count) {
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
                timetable.addLesson(timetable.availableLessonTypes[Math.floor(Math.random() * (2 - 0 + 1)) + 0], genDate);
            } else {
                i--;
            }
            genDate.setTime(genDate.getTime()+ 1 * 60 * 60 * 1000);
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

        debugger;
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

    const timetable = {
        availableLessonTypes:  ['junior', 'middle', 'senior'],
        allUsers: [],
        lessons: [],

        getFreeLessons: function() {
            let result = [];
            for(let i in this.lessons) {
                if(this.lessons[i].isFree()) {
                    result.push(this.lessons[i]);
                }
            }
            return result;
        },

        getFreeLessonsByRange: function(minDate, maxDate) {
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
        },

        getFreeLessonsHoursOnDay: function(date) {
            let result = [];
            try {
                if(date.getDate()) {
                    for(let i in this.lessons) {
                        if(this.lessons[i].isFree() && this.lessons[i].lessonTime.getDate() == date.getDate() && this.lessons[i].lessonTime.getMonth() == date.getMonth() && this.lessons[i].lessonTime.getFullYear() == date.getFullYear()) {
                            result.push(this.lessons[i].getHours());
                        }
                    }
                    return result;
                }
            } catch (error) {
                console.log('iccorrect Date');
                return undefined;
            }
        },

        getLessonsByDate: function(date) {
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
        }, 
        
        isRegistered: function(user) {
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

        },

        isExistsLesson: function (lessonId) {
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
        },

        bookUser: function (userName, userEmail, lessonId) {
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
        },

        addLesson: function (lessonType, lessonTime, maxUsers) {
            let result = new Lesson(this.lessons.length, lessonType, lessonTime, maxUsers);
            try {
                result.isFree();
                this.lessons.push(result);
            } catch (error) {
                
            }
        }
    }

    // 
    // generateLessons(300);
    // console.dir(timetable);

    // let curD = new Date(),
    //     minD = new Date(curD.getTime() - (17 * 24 * 60 * 60 * 1000) - (15 * 60 * 60 * 1000));
    //     minD.setMinutes(0, 0, 0);
    //     maxD = new Date(curD.getTime() + (13 * 24 * 60 * 60 * 1000) - (15 * 60 * 60 * 1000));
    //     maxD.setMinutes(0, 0, 0);

    generateLessons(360);
    scheduleGeneration(98, new Date(), new Date(new Date().fp_incr(6).setHours(23,59,59,999)));
    scheduleGeneration(99, new Date().fp_incr(7), new Date(new Date().fp_incr(29).setHours(23,59,59,999)));

    for(let i in timetable.lessons) {
        console.log(`${timetable.lessons[i].lessonTime}: ${timetable.lessons[i].lessonUsers.length} / ${timetable.lessons[i].maxUsers}`);
    }
    

    // scroll 

    const calendarElem = document.querySelector('#calendar'),
          calendar = flatpickr(calendarElem, {
        "locale": "uk",
        altInput: true,
        altFormat: "j F, Y",
        dateFormat: "Y-m-d",
        minDate: 'today',
        maxDate: new Date().fp_incr(30),
    });

    calendar.config.onChange.push(function(selectedDates, dateStr) {
        console.dir(selectedDates);
        selectedDates[0].setHours(17);
        console.dir(`${selectedDates[0].getDate()}.${selectedDates[0].getMonth()}.${selectedDates[0].getFullYear()} ${selectedDates[0].getHours()}`);
     } );



    function scroll(item) {
        $(item).click(function(){
            const _href = $(item).attr("href");
            $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
            return false;
        });
    }

    scroll($("a[href=#waiting]"));
})