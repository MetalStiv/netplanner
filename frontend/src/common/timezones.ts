interface ITimeZone {
    id: number,
    offset: number,
    text: string,
    utc: string []
}

export const timeZones: ITimeZone[] = [
    {
        "id": 1,
        "offset": -12,
        "text": "UTC-12:00",
        "utc": [
            "Etc/GMT+12"
        ]
    },
    {
        "id": 2,
        "offset": -11,
        "text": "UTC-11:00",
        "utc": [
            "Etc/GMT+11",
            "Pacific/Midway",
            "Pacific/Niue",
            "Pacific/Pago_Pago"
        ]
    },
    {
        "id": 3,
        "offset": -10,
        "text": "UTC-10:00",
        "utc": [
            "Etc/GMT+10",
            "Pacific/Honolulu",
            "Pacific/Johnston",
            "Pacific/Rarotonga",
            "Pacific/Tahiti"
        ]
    },
    {
        "id": 4,
        "offset": -9,
        "text": "UTC-09:00",
        "utc": [
            "America/Anchorage",
            "America/Juneau",
            "America/Nome",
            "America/Sitka",
            "America/Yakutat"
        ]
    },
    {
        "id": 5,
        "offset": -8,
        "text": "UTC-08:00",
        "utc": [
            "America/Santa_Isabel"
        ]
    },
    {
        "id": 6,
        "offset": -7,
        "text": "UTC-07:00",
        "utc": [
            "America/Los_Angeles",
            "America/Tijuana",
            "America/Vancouver"
        ]
    },
    {
        "id": 7,
        "offset": -6,
        "text": "UTC-06:00",
        "utc": [
            "America/Belize",
            "America/Costa_Rica",
            "America/El_Salvador",
            "America/Guatemala",
            "America/Managua",
            "America/Tegucigalpa",
            "Etc/GMT+6",
            "Pacific/Galapagos"
        ]
    },
    {
        "id": 8,
        "offset": -5,
        "text": "UTC-05:00",
        "utc": [
            "America/Bogota",
            "America/Cayman",
            "America/Coral_Harbour",
            "America/Eirunepe",
            "America/Guayaquil",
            "America/Jamaica",
            "America/Lima",
            "America/Panama",
            "America/Rio_Branco",
            "Etc/GMT+5"
        ]
    },
    {
        "id": 9,
        "offset": -4.5,
        "text": "UTC-04:30",
        "utc": [
          "America/Caracas"
        ]
    },
    {
        "id": 10,
        "offset": -4,
        "text": "UTC-04:00",
        "utc": [
            "America/Detroit",
            "America/Havana",
            "America/Indiana/Petersburg",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Iqaluit",
            "America/Kentucky/Monticello",
            "America/Louisville",
            "America/Montreal",
            "America/Nassau",
            "America/New_York",
            "America/Nipigon",
            "America/Pangnirtung",
            "America/Port-au-Prince",
            "America/Thunder_Bay",
            "America/Toronto"
        ]
    },
    {
        "id": 11,
        "offset": -2.5,
        "text": "UTC-03:30",
        "utc": [
            "America/St_Johns"
        ]
    },
    {
        "id": 12,
        "offset": -3,
        "text": "UTC-03:00",
        "utc": [
            "America/Sao_Paulo"
        ]
    },
    {
        "id": 13,
        "offset": -2,
        "text": "UTC-02:00",
        "utc": [
            "America/Noronha",
            "Atlantic/South_Georgia",
            "Etc/GMT+2"
        ]
    },
    {
        "id": 14,
        "offset": 0,
        "text": "UTC-01:00",
        "utc": [
            "America/Scoresbysund",
            "Atlantic/Azores"
        ]
    },
    {
        "id": 15,
        "offset": 0,
        "text": "UTC",
        "utc": [
            "America/Danmarkshavn",
            "Etc/GMT"
        ]
    },
    {
        "id": 16,
        "offset": 2,
        "text": "UTC+01:00",
        "utc": [
            "Arctic/Longyearbyen",
            "Europe/Amsterdam",
            "Europe/Andorra",
            "Europe/Berlin",
            "Europe/Busingen",
            "Europe/Gibraltar",
            "Europe/Luxembourg",
            "Europe/Malta",
            "Europe/Monaco",
            "Europe/Oslo",
            "Europe/Rome",
            "Europe/San_Marino",
            "Europe/Stockholm",
            "Europe/Vaduz",
            "Europe/Vatican",
            "Europe/Vienna",
            "Europe/Zurich"
        ]
    },
    {
        "id": 17,
        "offset": 3,
        "text": "UTC+02:00",
        "utc": [
            "Asia/Nicosia",
            "Europe/Athens",
            "Europe/Bucharest",
            "Europe/Chisinau"
        ]
    },
    {
        "id": 18,
        "offset": 3,
        "text": "UTC+03:00",
        "utc": [
            "Europe/Kirov",
            "Europe/Moscow",
            "Europe/Simferopol",
            "Europe/Volgograd",
            "Europe/Minsk"
        ]
    },
    {
        "id": 19,
        "offset": 3.5,
        "text": "UTC+03:30",
        "utc": [
            "Asia/Tehran"
        ]
    },
    {
        "id": 20,
        "offset": 4,
        "text": "UTC+04:00",
        "utc": [
            "Europe/Astrakhan",
            "Europe/Samara",
            "Europe/Ulyanovsk"
        ]
    },
    {
        "id": 21,
        "offset": 4.5,
        "text": "UTC+04:30",
        "utc": [
            "Asia/Kabul"
        ]
    },
    {
        "id": 22,
        "offset": 5,
        "text": "UTC+05:00",
        "utc": [
            "Antarctica/Mawson",
            "Asia/Aqtau",
            "Asia/Aqtobe",
            "Asia/Ashgabat",
            "Asia/Dushanbe",
            "Asia/Oral",
            "Asia/Samarkand",
            "Asia/Tashkent",
            "Etc/GMT-5",
            "Indian/Kerguelen",
            "Indian/Maldives"
        ]
    },
    {
        "id": 23,
        "offset": 5.5,
        "text": "UTC+05:30",
        "utc": [
            "Asia/Kolkata",
            "Asia/Calcutta"
        ]
    },
    {
        "id": 24,
        "offset": 5.75,
        "text": "UTC+05:45",
        "utc": [
            "Asia/Kathmandu"
        ]
    },
    {
        "id": 25,
        "offset": 6,
        "text": "UTC+06:00",
        "utc": [
            "Antarctica/Vostok",
            "Asia/Almaty",
            "Asia/Bishkek",
            "Asia/Qyzylorda",
            "Asia/Urumqi",
            "Etc/GMT-6",
            "Indian/Chagos"
        ]
    },
    {
        "id": 26,
        "offset": 6.5,
        "text": "UTC+06:30",
        "utc": [
            "Asia/Rangoon",
            "Indian/Cocos"
        ]
    },
    {
        "id": 27,
        "offset": 7,
        "text": "UTC+07:00",
        "utc": [
            "Antarctica/Davis",
            "Asia/Bangkok",
            "Asia/Hovd",
            "Asia/Jakarta",
            "Asia/Phnom_Penh",
            "Asia/Pontianak",
            "Asia/Saigon",
            "Asia/Vientiane",
            "Etc/GMT-7",
            "Indian/Christmas"
        ]
    },
    {
        "id": 28,
        "offset": 8,
        "text": "UTC+08:00",
        "utc": [
            "Asia/Hong_Kong",
            "Asia/Macau",
            "Asia/Shanghai"
        ]
    },
    {
        "id": 29,
        "offset": 9,
        "text": "UTC+09:00",
        "utc": [
            "Asia/Dili",
            "Asia/Jayapura",
            "Asia/Tokyo",
            "Etc/GMT-9",
            "Pacific/Palau"
        ]
    },
    {
        "id": 30,
        "offset": 9.5,
        "text": "UTC+09:30",
        "utc": [
            "Australia/Adelaide",
            "Australia/Broken_Hill"
        ]
    },
    {
        "id": 31,
        "offset": 10,
        "text": "UTC+10:00",
        "utc": [
            "Australia/Brisbane",
            "Australia/Lindeman"
        ]
    },
    {
        "id": 32,
        "offset": 11,
        "text": "UTC+11:00",
        "utc": [
            "Antarctica/Macquarie",
            "Etc/GMT-11",
            "Pacific/Efate",
            "Pacific/Guadalcanal",
            "Pacific/Kosrae",
            "Pacific/Noumea",
            "Pacific/Ponape"
        ]
    },
    {
        "id": 33,
        "offset": 12,
        "text": "UTC+12:00",
        "utc": [
            "Antarctica/McMurdo",
            "Pacific/Auckland"
        ]
    },
    {
        "id": 34,
        "offset": 13,
        "text": "UTC+13:00",
        "utc": [
            "Etc/GMT-13",
            "Pacific/Enderbury",
            "Pacific/Fakaofo",
            "Pacific/Tongatapu"
        ]
    }
]