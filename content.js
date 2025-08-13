// ИГРОВОЙ КОНТЕНТ + КАРТА СТАНДАРТА ICI 01:2024
const STANDARD_MAP = [
  { id:'gov_policy', title:'1. Политика пациентоцентричности и лидерство', section:'Раздел 1', req:'Политика, комитет, аудит', unlocked:false },
  { id:'rights', title:'2. Права пациента и жалобы', section:'Раздел 2', req:'Публикация прав, процедура жалоб', unlocked:false },
  { id:'privacy', title:'2.7 Конфиденциальность', section:'Раздел 2', req:'Политика защиты мед. информации', unlocked:false },
  { id:'consent', title:'2.8 Информированное согласие', section:'Раздел 2', req:'Стандартизированные формы и процесс', unlocked:false },
  { id:'prefs', title:'3. Предпочтения пациента', section:'Раздел 3', req:'Учет равнозначных вариантов/быта', unlocked:false },
  { id:'coordination', title:'4. Координация и передача инфо', section:'Раздел 4', req:'Лечащий врач, план лечения, хэндоверы', unlocked:false },
  { id:'education', title:'5. Обучение пациентов', section:'Раздел 5', req:'Оценка потребностей, материалы', unlocked:false },
  { id:'comfort', title:'6. Комфорт и обезболивание', section:'Раздел 6', req:'Оценка боли, условия среды', unlocked:false },
  { id:'support', title:'7–8. Поддержка и семья', section:'Разделы 7–8', req:'Эмоц./соц. поддержка, доступ семьи', unlocked:false },
  { id:'access', title:'9. Доступность/запись/перевод', section:'Раздел 9', req:'Навигация, кнопки вызова, перевод', unlocked:false },
  { id:'continuity', title:'10. Непрерывность и передача ответственности', section:'Раздел 10', req:'Документированные процедуры, из рук в руки', unlocked:false },
];

const GAME_CONTENT = {
  stages: [
    {
      id: "diagnostics",
      title: "Этап 1: Диагностика",
      intro: "Старт в хаосе. Нужна ясная картина и быстрые победы.",
      events: [
        {
          key:'survey',
          title: "Сбор данных",
          text: "Как начать при ограниченных ресурсах?",
          choices: [
            { text: "Опрос пациентов/персонала (онлайн+оффлайн)",
              effects: { patients: +4, staff: +2, finance: -2, maturity: +6 },
              unlocks:['gov_policy']
            },
            { text: "Положиться на старый отчёт и сразу реформы",
              effects: { patients: -2, staff: -1, finance: +1, maturity: +1 }
            },
            { text: "Дорогой консалтинг на месяц",
              effects: { patients: +1, staff: 0, finance: -6, maturity: +3 }
            }
          ]
        },
        {
          key:'fastlane',
          title: "Первичные приоритеты",
          text: "Очереди и путаница с записями.",
          choices: [
            { text: "Открыть «быстрые окна» для простых обращений",
              effects: { patients: +5, staff: +1, finance: -1, maturity: +3 }
            },
            { text: "Перенастроить расписания всех отделений сразу",
              effects: { patients: +1, staff: -3, finance: -2, maturity: +2 }
            }
          ]
        }
      ]
    },
    {
      id: "training",
      title: "Этап 2: Обучение и коммуникация",
      intro: "Без вовлеченного персонала стандарта не будет.",
      events: [
        {
          key:'learning',
          title: "Формат обучения персонала",
          text: "Как обучать стандарту и сервису?",
          choices: [
            { text: "Короткие практические модули + кейсы нашей больницы",
              effects: { patients: +3, staff: +5, finance: -2, maturity: +5 },
              unlocks:['education']
            },
            { text: "Длинные лекции вечером",
              effects: { patients: 0, staff: -4, finance: -1, maturity: +2 }
            }
          ]
        },
        {
          key:'feedback',
          title: "Обратная связь пациентов",
          text: "Как выстроить обратную связь?",
          choices: [
            { text: "QR-опросы после визита + горячая линия с SLA",
              effects: { patients: +6, staff: +1, finance: -2, maturity: +4 },
              unlocks:['rights']
            },
            { text: "Квартальный отчёт на сайте",
              effects: { patients: +1, staff: 0, finance: 0, maturity: +1 }
            }
          ]
        }
      ]
    },
    {
      id: "process",
      title: "Этап 3: Процессы и права",
      intro: "Переписываем маршрут пациента и закрываем риски 2.7 / 2.8.",
      events: [
        {
          key:'privacy',
          title: "Конфиденциальность (2.7)",
          text: "Доступы и правила обращение с мед. инфо разрознены.",
          choices: [
            { text: "Ввести политику конфиденциальности + обучение + контроль доступа",
              effects: { patients: +3, staff: +2, finance: -1, maturity: +6 },
              unlocks:['privacy']
            },
            { text: "Оставить как есть, «позже займемся»",
              effects: { patients: -3, staff: 0, finance: 0, maturity: -1 }
            }
          ]
        },
        {
          key:'consent',
          title: "Информированное согласие (2.8)",
          text: "Нет единых бланков и процесса — риски и жалобы.",
          choices: [
            { text: "Стандартизировать бланки + тренинг по объяснению рисков и альтернатив",
              effects: { patients: +5, staff: +2, finance: -1, maturity: +7 },
              unlocks:['consent']
            },
            { text: "Оставить усмотрение врача по ситуации",
              effects: { patients: -2, staff: 0, finance: 0, maturity: 0 }
            }
          ]
        }
      ]
    },
    {
      id: "digital",
      title: "Этап 4: Доступность и цифровые сервисы",
      intro: "Сервисы работают, когда среда доступна и понятна.",
      events: [
        {
          key:'readability',
          title: "Читаемость информации (9.8)",
          text: "Пациенты жалуются, что не могут прочитать важные сведения.",
          choices: [
            { text: "Увеличить шрифты на табло/листах, улучшить освещение, стандартизировать рецепты",
              effects: { patients: +4, staff: +1, finance: -1, maturity: +5 },
              unlocks:['access']
            },
            { text: "Оставить как есть — «и так понятно»",
              effects: { patients: -3, staff: -1, finance: 0, maturity: 0 }
            }
          ]
        },
        {
          key:'handover',
          title: "Непрерывность и передача ответственности (10.2)",
          text: "Хэндоверы и переводы проходят стихийно.",
          choices: [
            { text: "Внедрить процедуры передачи: отделения/переводы/выписка/смена, из рук в руки",
              effects: { patients: +5, staff: +3, finance: +1, maturity: +6 },
              unlocks:['continuity','coordination']
            },
            { text: "Ничего не менять",
              effects: { patients: -2, staff: -1, finance: 0, maturity: -1 }
            }
          ]
        }
      ]
    },
    {
      id: "qa",
      title: "Этап 5: Цикл улучшений и закрепление",
      intro: "Публикуем KPI и запускаем постоянные улучшения.",
      events: [
        {
          key:'kpi',
          title: "KPI и прозрачность",
          text: "Публикуем дашборды и анализируем жалобы?",
          choices: [
            { text: "Ежемесячные KPI (ожидание, жалобы, NPS) + разбор кейсов",
              effects: { patients: +5, staff: +4, finance: +1, maturity: +7 },
              unlocks:['gov_policy']
            },
            { text: "Только внутренние отчеты для руководства",
              effects: { patients: -1, staff: 0, finance: +1, maturity: +1 }
            }
          ]
        }
      ]
    }
  ],

  endings: [
    { id: "ideal", condition: s => s.maturity >= 80 && s.patients >= 70 && s.staff >= 60 && s.finance >= 50,
      title: "Идеальный исход", text: "Больница стала образцом пациентоцентричности. Пациенты довольны, персонал вовлечен, финансы устойчивы." },
    { id: "partial", condition: s => s.maturity >= 60 && s.patients >= 50,
      title: "Частичный успех", text: "Стандарт внедрен частично. База есть, требуется продолжение цикла улучшений." },
    { id: "fail", condition: s => true,
      title: "Провал", text: "Реформы не закрепились. Попробуйте другой набор решений." }
  ],

  randomEvents: [
    { title: "Вспышка ОРВИ", text: "Наплыв пациентов, очереди растут.",
      choices: [
        { text: "Открыть временный триеж-пост + информирование",
          effects: { patients: +2, staff: -1, finance: -1, maturity: +2 } },
        { text: "Игнорировать, «само пройдет»",
          effects: { patients: -4, staff: -1, finance: 0, maturity: -1 } }
      ]
    },
    { title: "Поломка автоклава", text: "Операционный блок частично стоит.",
      choices: [
        { text: "Экстренный ремонт и ротация расписания",
          effects: { patients: -1, staff: -1, finance: -3, maturity: +2 } },
        { text: "Отложить до планового ремонта",
          effects: { patients: -3, staff: -2, finance: +1, maturity: -1 } }
      ]
    }
  ]
};
