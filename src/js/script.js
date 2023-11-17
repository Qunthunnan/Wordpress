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
        if(maxLength) {
            let length = 0;
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

    function generateRandomDateTime() {
        var currentDate = new Date(); // Поточна дата та час
        var randomDays = Math.floor(Math.random() * 30); // Випадкова кількість днів в межах 0-29
        var randomHours = Math.floor(Math.random() * (19 - 8 + 1)) + 8; // Випадкова кількість годин в межах 8-19
        var futureDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000); // Додаємо випадкову кількість мілісекунд
        futureDate.setHours(randomHours, 0, 0, 0); // Встановлюємо випадкову годину, хвилину та секунду
    
        return futureDate;
    }

    function generateUser() {
        let userName = generateRandomString(3, 10);
        let userEmail = `${generateRandomString(5, 10)}@mail.com`;
        let book = generateRandomDateTime();

        return user.createUser(userName, userEmail, book);
    }

    function generateLessons() {
        let resultSchedule = [];
        let curDate = new Date();
        let genDate = new Date(curDate.getTime() + 1 * 60 * 60 * 1000);
        const minWorkHour = 8,
              maxWorkHour = 19;
        genDate.setMinutes(0, 0, 0);
        for(let i = 0; i < 360; i++) {
            if(genDate.getHours() <= maxWorkHour && genDate.getHours() >= minWorkHour) {
                
            }
        }
    }

    function scheduleGeneration(timetable) {
        let lessons = [],
            users = [];
        const availableLessonTypes =  ['junior, middle, senior'];

    }

    const user = {
        userName: '',
        userEmail: '',
        userBook: '',

        createUser: function (name, email, bookTime) {
            if(name) {
                this.userName = name;
            } else {
                console.log('Name is not defined');
                return undefined;
            }

            if(email) {
                this.userEmail = email;
            } else {
                console.log('Email is not defined');
                return undefined;
            }

            try {
                if(bookTime.getDate()) {
                    this.userBook = bookTime;
                }
            } catch (error) {
                console.log('Book Date icorrect');
            }
            return this;
        }
    }

    const lesson = {
        availableLessonTypes: ['junior', 'middle', 'senior'],
        lessonType: '',
        lessonUsers: [],
        lessonTime: '',
        maxUsers: 0,

        isFree: function () {
            if(this.lessonUsers.length < this.maxUsers) {
                return true;
            } else {
                return false;
            }
        },

        getLessonType: function () {
            return this.lessonType
        },

        getLessonTime: function () {
            return this.lessonTime
        },

        addUser: function (user) {
            if(user.userName) {
                if(this.isFree()) {
                    this.lessonUsers.push(user);
                } else {
                    console.log(`Lesson ${this.lessonTime} is full`);
                }
                
            } else {
                console.log('User data is broken');
            }
        },

        createLesson: function (lessonType, lessonTime, user, maxUsers) {
            debugger;
            for(let i in this.availableLessonTypes) {
                if(lessonType == this.availableLessonTypes[i]) {
                    this.lessonType = lessonType;
                    break;
                }
            }

            if(!this.lessonType) {
                console.log('Type Lesson not allowed, use allowed lesson type');
                return undefined;
            }

            try {
                if(lessonTime.getDate()) {
                    this.lessonTime = lessonTime;
                }
            } catch (error) {
                console.log('lessonTime is empty or corrupted');
                return undefined
            }

            try {
                if(user.userName) {
                    this.lessonUsers.push(user);
                }
            } catch (error) {
                
            }


            if(maxUsers && typeof(maxUsers) == 'number') {
                this.maxUsers = maxUsers;
            } else {
                maxUsers = 20;
            }

            return this;
        }
    }

    const timetable = {
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

        getFreeLessonsHoursOnDay: function(date) {
            let result = [];
            try {
                if(date.getDate()) {
                    for(let i in this.lessons) {
                        if(this.lessons[i].isFree() && this.lessons[i].lessonTime.getDate() == date.getDate() || this.lessons[i].lessonTime.getMonth() == date.getMonth() || this.lessons[i].lessonTime.getFullYear() == date.getFullYear()) {
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

        getLessonByDate: function(date) {
            if(date.getDate()) {
                for(let i in this.lessons) {
                    if(this.lessons[i].lessonTime = date) {
                        return this.lessons[i];
                    } else {
                        console.log('Lesson is not found');
                        return undefined;
                    }
                }
            } else {
                console.log('iccorrect Date');
                return undefined;
            }
        }, 
        
        isRegistered: function(user) {
            if(user.userName) {
                for(let i in this.allUsers) {
                    if(user.email == this.allUsers[i].email) {
                        return i;
                    } else {
                        return false;
                    }
                }
            } else {
                console.log('User Data is corrupted');
            }
        },

        isExistsLesson: function (lessonTime) {
            if(lessonTime.getDate()) {
                for(let i in this.lessons) {
                    if(lessonTime == this.lessons[i]) {
                        console.log(`Warning! Lesson ${lessonTime} is exists`);
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                console.log('Date is icorrect');
                return false;
            }
        },

        bookUser: function (user, lessonTime) {
            if(user.userName) {
                if(lessonTime.getDate()) {
                    let answer = this.isRegistered(user);
                    if(!answer) {
                        for(let i in this.lessons) {
                            if(lessonTime == this.lessons[i].lessonTime) {
                                this.allUsers.push(user);
                                this.lessons[i].addUser(user);
                            } else {
                                console.log(`Lesson ${lessonTime} is not found`);
                            }
                        }
                    } else {
                        console.log(`This user ${answer} ${user.userName} ${user.userEmail} already exists`);
                    }
                } else {
                    console.log('Date is icorrect');
                }
            } else {
                console.log('User Data is corrupted');
            }
        },

        addLesson: function (lessonType, lessonTime, user, maxUsers) {
            let result = lesson.createLesson(lessonType, lessonTime, user, maxUsers);
            if (result) {
                this.lessons.push(result);
            }
        }
    }


    // for(let i = 0; i < 10; i++) {
    //     console.log(generateRandomString(3, 10));
    // }

    console.log(lesson.createLesson('junior', new Date()));
    

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