$().ready(function () {
    $.validator.addMethod("minlenghtphone", function (value, element) {//доп.методы для того чтобы подружить masked input и jquery validate
        return value.replace(/\D+/g, '').length > 10;
    },
            "Укажите корректный номер");

    $.validator.addMethod("requiredphone", function (value, element) {
        return value.replace(/\D+/g, '').length > 1;
    },
    "Укажите номер телефона");

    var common = {//стилизация полей - общие правила для всех форм
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]").parent('.g-input-field').addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]").parent('.g-input-field').removeClass(errorClass).addClass(validClass);
        },
    };


    (function () {
        var order = {//правила для формы Отправить Заявку в модальном окне
            rules: {
                ord_name: {
                    required: true,
                    minlength: 2
                },
                ord_phone: {
                    requiredphone: true,
                    minlenghtphone: true
                }
            }
        };

        $('#order').find('form').validate($.extend(common, order));
    })();
    
    (function () {
        var callback = {//правила для формы Заказать Обратный Звонок в модальном окне
            rules: {
                clb_name: {
                    required: true,
                    minlength: 2
                },
                clb_phone: {
                    requiredphone: true,
                    minlenghtphone: true
                }
            }
        };
        $('#callback').find('form').validate($.extend(common, callback));
    })();
    
    (function () {
        var footer = {//правила для формы Обратная Связь в футере
            rules: {
                ftr_name: {
                    required: true,
                    minlength: 2
                },
                ftr_mail: {
                    required: true,
                    email: true
                }
            }
        };
        $('#ftr_form').validate($.extend(common, footer));
    })();
    
    (function () {
        var doctor_review = {//правила для формы Отзыв о Специалисте
            rules: {
                dct_name: {
                    required: true,
                    minlength: 2
                },
                dct_mail: {
                    required: true,
                    email: true
                }
            }
        };
        $('#doctor_review').validate($.extend(common, doctor_review));
    })();
    
    (function () {
        var query = {//правила для формы Задать вопрос в карточке товара
            rules: {
                qr_name: {
                    required: true,
                    minlength: 2
                },
                qr_mail: {
                    required: true,
                    email: true
                },
                qr_quest: {
                    required: true,
                    minlength: 10,
                    maxlength: 160
                }
            }
        };
        $('#query').find('form').validate($.extend(common, query));
    })();
    
    (function () {
        var review = {//правила для формы Отзывы клиентов на странице Отзывы
            rules: {
                rvw_name: {
                    required: true,
                    minlength: 2
                },
                rvw_mail: {
                    required: true,
                    email: true
                },
                rvw_msg: {
                    required: true,
                    minlength: 10,
                    maxlength: 160
                }
            }
        };
        $('#review_form').validate($.extend(common, review));
    })();
    
    (function () {
        var comment = {//правила для формы в модальном окне Комментарий на странице Отзывы
            rules: {
                cmt_name: {
                    required: true,
                    minlength: 2
                },
                cmt_mail: {
                    required: true,
                    email: true
                },
                cmt_msg: {
                    required: true,
                    minlength: 10,
                    maxlength: 160
                }
            }
        };
        $('#comment').find('form').validate($.extend(common, comment));
    })();
    
    (function () {
        var send_quest = {//правила для формы Часто Задаваемые Вопросы на странице Вопросы
            rules: {
                snq_name: {
                    required: true,
                    minlength: 2
                },
                snq_mail: {
                    required: true,
                    email: true
                },
                snq_msg: {
                    required: true,
                    minlength: 10,
                    maxlength: 160
                }
            }
        };
        $('#send_quest').validate($.extend(common, send_quest));
    })();
    
    
});