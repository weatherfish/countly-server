var ApplicationsPage = React.createClass({

    app_categories : false,
/*
    app_name : false,
    name:appName,
    category:$("#app-edit-category .cly-select .text").data("value") + '',
    timezone:
    */

    getAppCategories: function(){
        return { 1:jQuery.i18n.map["application-category.books"], 2:jQuery.i18n.map["application-category.business"], 3:jQuery.i18n.map["application-category.education"], 4:jQuery.i18n.map["application-category.entertainment"], 5:jQuery.i18n.map["application-category.finance"], 6:jQuery.i18n.map["application-category.games"], 7:jQuery.i18n.map["application-category.health-fitness"], 8:jQuery.i18n.map["application-category.lifestyle"], 9:jQuery.i18n.map["application-category.medical"], 10:jQuery.i18n.map["application-category.music"], 11:jQuery.i18n.map["application-category.navigation"], 12:jQuery.i18n.map["application-category.news"], 13:jQuery.i18n.map["application-category.photography"], 14:jQuery.i18n.map["application-category.productivity"], 15:jQuery.i18n.map["application-category.reference"], 16:jQuery.i18n.map["application-category.social-networking"], 17:jQuery.i18n.map["application-category.sports"], 18:jQuery.i18n.map["application-category.travel"], 19:jQuery.i18n.map["application-category.utilities"], 20:jQuery.i18n.map["application-category.weather"]};
    },

    getTimeZones: function(){
        return { "AF":{"n":"Afghanistan","z":[{"(GMT+04:30) Kabul":"Asia/Kabul"}]}, "AL":{"n":"Albania","z":[{"(GMT+01:00) Tirane":"Europe/Tirane"}]}, "DZ":{"n":"Algeria","z":[{"(GMT+01:00) Algiers":"Africa/Algiers"}]}, "AS":{"n":"American Samoa","z":[{"(GMT-11:00) Pago Pago":"Pacific/Pago_Pago"}]}, "AD":{"n":"Andorra","z":[{"(GMT+01:00) Andorra":"Europe/Andorra"}]}, "AO":{"n":"Angola","z":[{"(GMT+01:00) Luanda":"Africa/Luanda"}]}, "AI":{"n":"Anguilla","z":[{"(GMT-04:00) Anguilla":"America/Anguilla"}]}, "AQ":{"n":"Antarctica","z":[{"(GMT-04:00) Palmer":"Antarctica/Palmer"},{"(GMT-03:00) Rothera":"Antarctica/Rothera"},{"(GMT+03:00) Syowa":"Antarctica/Syowa"},{"(GMT+05:00) Mawson":"Antarctica/Mawson"},{"(GMT+06:00) Vostok":"Antarctica/Vostok"},{"(GMT+07:00) Davis":"Antarctica/Davis"},{"(GMT+08:00) Casey":"Antarctica/Casey"},{"(GMT+10:00) Dumont D'Urville":"Antarctica/DumontDUrville"}]}, "AG":{"n":"Antigua and Barbuda","z":[{"(GMT-04:00) Antigua":"America/Antigua"}]}, "AR":{"n":"Argentina","z":[{"(GMT-03:00) Buenos Aires":"America/Buenos_Aires"}]}, "AM":{"n":"Armenia","z":[{"(GMT+04:00) Yerevan":"Asia/Yerevan"}]}, "AW":{"n":"Aruba","z":[{"(GMT-04:00) Aruba":"America/Aruba"}]}, "AU":{"n":"Australia","z":[{"(GMT+08:00) Western Time - Perth":"Australia/Perth"},{"(GMT+09:30) Central Time - Adelaide":"Australia/Adelaide"},{"(GMT+09:30) Central Time - Darwin":"Australia/Darwin"},{"(GMT+10:00) Eastern Time - Brisbane":"Australia/Brisbane"},{"(GMT+10:00) Eastern Time - Hobart":"Australia/Hobart"},{"(GMT+10:00) Eastern Time - Melbourne, Sydney":"Australia/Sydney"}]}, "AT":{"n":"Austria","z":[{"(GMT+01:00) Vienna":"Europe/Vienna"}]}, "AZ":{"n":"Azerbaijan","z":[{"(GMT+04:00) Baku":"Asia/Baku"}]}, "BS":{"n":"Bahamas","z":[{"(GMT-05:00) Nassau":"America/Nassau"}]}, "BH":{"n":"Bahrain","z":[{"(GMT+03:00) Bahrain":"Asia/Bahrain"}]}, "BD":{"n":"Bangladesh","z":[{"(GMT+06:00) Dhaka":"Asia/Dhaka"}]}, "BB":{"n":"Barbados","z":[{"(GMT-04:00) Barbados":"America/Barbados"}]}, "BY":{"n":"Belarus","z":[{"(GMT+03:00) Minsk":"Europe/Minsk"}]}, "BE":{"n":"Belgium","z":[{"(GMT+01:00) Brussels":"Europe/Brussels"}]}, "BZ":{"n":"Belize","z":[{"(GMT-06:00) Belize":"America/Belize"}]}, "BJ":{"n":"Benin","z":[{"(GMT+01:00) Porto-Novo":"Africa/Porto-Novo"}]}, "BM":{"n":"Bermuda","z":[{"(GMT-04:00) Bermuda":"Atlantic/Bermuda"}]}, "BT":{"n":"Bhutan","z":[{"(GMT+06:00) Thimphu":"Asia/Thimphu"}]}, "BO":{"n":"Bolivia","z":[{"(GMT-04:00) La Paz":"America/La_Paz"}]}, "BA":{"n":"Bosnia and Herzegovina","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Sarajevo"}]}, "BW":{"n":"Botswana","z":[{"(GMT+02:00) Gaborone":"Africa/Gaborone"}]}, "BR":{"n":"Brazil","z":[{"(GMT-04:00) Boa Vista":"America/Boa_Vista"},{"(GMT-04:00) Campo Grande":"America/Campo_Grande"},{"(GMT-04:00) Cuiaba":"America/Cuiaba"},{"(GMT-04:00) Manaus":"America/Manaus"},{"(GMT-04:00) Porto Velho":"America/Porto_Velho"},{"(GMT-04:00) Rio Branco":"America/Rio_Branco"},{"(GMT-03:00) Araguaina":"America/Araguaina"},{"(GMT-03:00) Belem":"America/Belem"},{"(GMT-03:00) Fortaleza":"America/Fortaleza"},{"(GMT-03:00) Maceio":"America/Maceio"},{"(GMT-03:00) Recife":"America/Recife"},{"(GMT-03:00) Salvador":"America/Bahia"},{"(GMT-03:00) Sao Paulo":"America/Sao_Paulo"},{"(GMT-02:00) Noronha":"America/Noronha"}]}, "IO":{"n":"British Indian Ocean Territory","z":[{"(GMT+06:00) Chagos":"Indian/Chagos"}]}, "VG":{"n":"British Virgin Islands","z":[{"(GMT-04:00) Tortola":"America/Tortola"}]}, "BN":{"n":"Brunei","z":[{"(GMT+08:00) Brunei":"Asia/Brunei"}]}, "BG":{"n":"Bulgaria","z":[{"(GMT+02:00) Sofia":"Europe/Sofia"}]}, "BF":{"n":"Burkina Faso","z":[{"(GMT+00:00) Ouagadougou":"Africa/Ouagadougou"}]}, "BI":{"n":"Burundi","z":[{"(GMT+02:00) Bujumbura":"Africa/Bujumbura"}]}, "KH":{"n":"Cambodia","z":[{"(GMT+07:00) Phnom Penh":"Asia/Phnom_Penh"}]}, "CM":{"n":"Cameroon","z":[{"(GMT+01:00) Douala":"Africa/Douala"}]}, "CA":{"n":"Canada","z":[{"(GMT-07:00) Mountain Time - Dawson Creek":"America/Dawson_Creek"},{"(GMT-08:00) Pacific Time - Vancouver":"America/Vancouver"},{"(GMT-08:00) Pacific Time - Whitehorse":"America/Whitehorse"},{"(GMT-06:00) Central Time - Regina":"America/Regina"},{"(GMT-07:00) Mountain Time - Edmonton":"America/Edmonton"},{"(GMT-07:00) Mountain Time - Yellowknife":"America/Yellowknife"},{"(GMT-06:00) Central Time - Winnipeg":"America/Winnipeg"},{"(GMT-05:00) Eastern Time - Iqaluit":"America/Iqaluit"},{"(GMT-05:00) Eastern Time - Montreal":"America/Montreal"},{"(GMT-05:00) Eastern Time - Toronto":"America/Toronto"},{"(GMT-04:00) Atlantic Time - Halifax":"America/Halifax"},{"(GMT-03:30) Newfoundland Time - St. Johns":"America/St_Johns"}]}, "CV":{"n":"Cape Verde","z":[{"(GMT-01:00) Cape Verde":"Atlantic/Cape_Verde"}]}, "KY":{"n":"Cayman Islands","z":[{"(GMT-05:00) Cayman":"America/Cayman"}]}, "CF":{"n":"Central African Republic","z":[{"(GMT+01:00) Bangui":"Africa/Bangui"}]}, "TD":{"n":"Chad","z":[{"(GMT+01:00) Ndjamena":"Africa/Ndjamena"}]}, "CL":{"n":"Chile","z":[{"(GMT-06:00) Easter Island":"Pacific/Easter"},{"(GMT-04:00) Santiago":"America/Santiago"}]}, "CN":{"n":"China","z":[{"(GMT+08:00) China Time - Beijing":"Asia/Shanghai"}]}, "CX":{"n":"Christmas Island","z":[{"(GMT+07:00) Christmas":"Indian/Christmas"}]}, "CC":{"n":"Cocos [Keeling] Islands","z":[{"(GMT+06:30) Cocos":"Indian/Cocos"}]}, "CO":{"n":"Colombia","z":[{"(GMT-05:00) Bogota":"America/Bogota"}]}, "KM":{"n":"Comoros","z":[{"(GMT+03:00) Comoro":"Indian/Comoro"}]}, "CD":{"n":"Congo [DRC]","z":[{"(GMT+01:00) Kinshasa":"Africa/Kinshasa"},{"(GMT+02:00) Lubumbashi":"Africa/Lubumbashi"}]}, "CG":{"n":"Congo [Republic]","z":[{"(GMT+01:00) Brazzaville":"Africa/Brazzaville"}]}, "CK":{"n":"Cook Islands","z":[{"(GMT-10:00) Rarotonga":"Pacific/Rarotonga"}]}, "CR":{"n":"Costa Rica","z":[{"(GMT-06:00) Costa Rica":"America/Costa_Rica"}]}, "CI":{"n":"Côte d’Ivoire","z":[{"(GMT+00:00) Abidjan":"Africa/Abidjan"}]}, "HR":{"n":"Croatia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Zagreb"}]}, "CU":{"n":"Cuba","z":[{"(GMT-05:00) Havana":"America/Havana"}]}, "CW":{"n":"Curaçao","z":[{"(GMT-04:00) Curacao":"America/Curacao"}]}, "CY":{"n":"Cyprus","z":[{"(GMT+02:00) Nicosia":"Asia/Nicosia"}]}, "CZ":{"n":"Czech Republic","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Prague"}]}, "DK":{"n":"Denmark","z":[{"(GMT+01:00) Copenhagen":"Europe/Copenhagen"}]}, "DJ":{"n":"Djibouti","z":[{"(GMT+03:00) Djibouti":"Africa/Djibouti"}]}, "DM":{"n":"Dominica","z":[{"(GMT-04:00) Dominica":"America/Dominica"}]}, "DO":{"n":"Dominican Republic","z":[{"(GMT-04:00) Santo Domingo":"America/Santo_Domingo"}]}, "EC":{"n":"Ecuador","z":[{"(GMT-06:00) Galapagos":"Pacific/Galapagos"},{"(GMT-05:00) Guayaquil":"America/Guayaquil"}]}, "EG":{"n":"Egypt","z":[{"(GMT+02:00) Cairo":"Africa/Cairo"}]}, "SV":{"n":"El Salvador","z":[{"(GMT-06:00) El Salvador":"America/El_Salvador"}]}, "GQ":{"n":"Equatorial Guinea","z":[{"(GMT+01:00) Malabo":"Africa/Malabo"}]}, "ER":{"n":"Eritrea","z":[{"(GMT+03:00) Asmera":"Africa/Asmera"}]}, "EE":{"n":"Estonia","z":[{"(GMT+02:00) Tallinn":"Europe/Tallinn"}]}, "ET":{"n":"Ethiopia","z":[{"(GMT+03:00) Addis Ababa":"Africa/Addis_Ababa"}]}, "FK":{"n":"Falkland Islands [Islas Malvinas]","z":[{"(GMT-03:00) Stanley":"Atlantic/Stanley"}]}, "FO":{"n":"Faroe Islands","z":[{"(GMT+00:00) Faeroe":"Atlantic/Faeroe"}]}, "FJ":{"n":"Fiji","z":[{"(GMT+12:00) Fiji":"Pacific/Fiji"}]}, "FI":{"n":"Finland","z":[{"(GMT+02:00) Helsinki":"Europe/Helsinki"}]}, "FR":{"n":"France","z":[{"(GMT+01:00) Paris":"Europe/Paris"}]}, "GF":{"n":"French Guiana","z":[{"(GMT-03:00) Cayenne":"America/Cayenne"}]}, "PF":{"n":"French Polynesia","z":[{"(GMT-10:00) Tahiti":"Pacific/Tahiti"},{"(GMT-09:30) Marquesas":"Pacific/Marquesas"},{"(GMT-09:00) Gambier":"Pacific/Gambier"}]}, "TF":{"n":"French Southern Territories","z":[{"(GMT+05:00) Kerguelen":"Indian/Kerguelen"}]}, "GA":{"n":"Gabon","z":[{"(GMT+01:00) Libreville":"Africa/Libreville"}]}, "GM":{"n":"Gambia","z":[{"(GMT+00:00) Banjul":"Africa/Banjul"}]}, "GE":{"n":"Georgia","z":[{"(GMT+04:00) Tbilisi":"Asia/Tbilisi"}]}, "DE":{"n":"Germany","z":[{"(GMT+01:00) Berlin":"Europe/Berlin"}]}, "GH":{"n":"Ghana","z":[{"(GMT+00:00) Accra":"Africa/Accra"}]}, "GI":{"n":"Gibraltar","z":[{"(GMT+01:00) Gibraltar":"Europe/Gibraltar"}]}, "GR":{"n":"Greece","z":[{"(GMT+02:00) Athens":"Europe/Athens"}]}, "GL":{"n":"Greenland","z":[{"(GMT-04:00) Thule":"America/Thule"},{"(GMT-03:00) Godthab":"America/Godthab"},{"(GMT-01:00) Scoresbysund":"America/Scoresbysund"},{"(GMT+00:00) Danmarkshavn":"America/Danmarkshavn"}]}, "GD":{"n":"Grenada","z":[{"(GMT-04:00) Grenada":"America/Grenada"}]}, "GP":{"n":"Guadeloupe","z":[{"(GMT-04:00) Guadeloupe":"America/Guadeloupe"}]}, "GU":{"n":"Guam","z":[{"(GMT+10:00) Guam":"Pacific/Guam"}]}, "GT":{"n":"Guatemala","z":[{"(GMT-06:00) Guatemala":"America/Guatemala"}]}, "GN":{"n":"Guinea","z":[{"(GMT+00:00) Conakry":"Africa/Conakry"}]}, "GW":{"n":"Guinea-Bissau","z":[{"(GMT+00:00) Bissau":"Africa/Bissau"}]}, "GY":{"n":"Guyana","z":[{"(GMT-04:00) Guyana":"America/Guyana"}]}, "HT":{"n":"Haiti","z":[{"(GMT-05:00) Port-au-Prince":"America/Port-au-Prince"}]}, "HN":{"n":"Honduras","z":[{"(GMT-06:00) Central Time - Tegucigalpa":"America/Tegucigalpa"}]}, "HK":{"n":"Hong Kong","z":[{"(GMT+08:00) Hong Kong":"Asia/Hong_Kong"}]}, "HU":{"n":"Hungary","z":[{"(GMT+01:00) Budapest":"Europe/Budapest"}]}, "IS":{"n":"Iceland","z":[{"(GMT+00:00) Reykjavik":"Atlantic/Reykjavik"}]}, "IN":{"n":"India","z":[{"(GMT+05:30) India Standard Time":"Asia/Calcutta"}]}, "ID":{"n":"Indonesia","z":[{"(GMT+07:00) Jakarta":"Asia/Jakarta"},{"(GMT+08:00) Makassar":"Asia/Makassar"},{"(GMT+09:00) Jayapura":"Asia/Jayapura"}]}, "IR":{"n":"Iran","z":[{"(GMT+03:30) Tehran":"Asia/Tehran"}]}, "IQ":{"n":"Iraq","z":[{"(GMT+03:00) Baghdad":"Asia/Baghdad"}]}, "IE":{"n":"Ireland","z":[{"(GMT+00:00) Dublin":"Europe/Dublin"}]}, "IL":{"n":"Israel","z":[{"(GMT+02:00) Jerusalem":"Asia/Jerusalem"}]}, "IT":{"n":"Italy","z":[{"(GMT+01:00) Rome":"Europe/Rome"}]}, "JM":{"n":"Jamaica","z":[{"(GMT-05:00) Jamaica":"America/Jamaica"}]}, "JP":{"n":"Japan","z":[{"(GMT+09:00) Tokyo":"Asia/Tokyo"}]}, "JO":{"n":"Jordan","z":[{"(GMT+02:00) Amman":"Asia/Amman"}]}, "KZ":{"n":"Kazakhstan","z":[{"(GMT+05:00) Aqtau":"Asia/Aqtau"},{"(GMT+05:00) Aqtobe":"Asia/Aqtobe"},{"(GMT+06:00) Almaty":"Asia/Almaty"}]}, "KE":{"n":"Kenya","z":[{"(GMT+03:00) Nairobi":"Africa/Nairobi"}]}, "KI":{"n":"Kiribati","z":[{"(GMT+12:00) Tarawa":"Pacific/Tarawa"},{"(GMT+13:00) Enderbury":"Pacific/Enderbury"},{"(GMT+14:00) Kiritimati":"Pacific/Kiritimati"}]}, "KW":{"n":"Kuwait","z":[{"(GMT+03:00) Kuwait":"Asia/Kuwait"}]}, "KG":{"n":"Kyrgyzstan","z":[{"(GMT+06:00) Bishkek":"Asia/Bishkek"}]}, "LA":{"n":"Laos","z":[{"(GMT+07:00) Vientiane":"Asia/Vientiane"}]}, "LV":{"n":"Latvia","z":[{"(GMT+02:00) Riga":"Europe/Riga"}]}, "LB":{"n":"Lebanon","z":[{"(GMT+02:00) Beirut":"Asia/Beirut"}]}, "LS":{"n":"Lesotho","z":[{"(GMT+02:00) Maseru":"Africa/Maseru"}]}, "LR":{"n":"Liberia","z":[{"(GMT+00:00) Monrovia":"Africa/Monrovia"}]}, "LY":{"n":"Libya","z":[{"(GMT+02:00) Tripoli":"Africa/Tripoli"}]}, "LI":{"n":"Liechtenstein","z":[{"(GMT+01:00) Vaduz":"Europe/Vaduz"}]}, "LT":{"n":"Lithuania","z":[{"(GMT+02:00) Vilnius":"Europe/Vilnius"}]}, "LU":{"n":"Luxembourg","z":[{"(GMT+01:00) Luxembourg":"Europe/Luxembourg"}]}, "MO":{"n":"Macau","z":[{"(GMT+08:00) Macau":"Asia/Macau"}]}, "MK":{"n":"Macedonia [FYROM]","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Skopje"}]}, "MG":{"n":"Madagascar","z":[{"(GMT+03:00) Antananarivo":"Indian/Antananarivo"}]}, "MW":{"n":"Malawi","z":[{"(GMT+02:00) Blantyre":"Africa/Blantyre"}]}, "MY":{"n":"Malaysia","z":[{"(GMT+08:00) Kuala Lumpur":"Asia/Kuala_Lumpur"}]}, "MV":{"n":"Maldives","z":[{"(GMT+05:00) Maldives":"Indian/Maldives"}]}, "ML":{"n":"Mali","z":[{"(GMT+00:00) Bamako":"Africa/Bamako"}]}, "MT":{"n":"Malta","z":[{"(GMT+01:00) Malta":"Europe/Malta"}]}, "MH":{"n":"Marshall Islands","z":[{"(GMT+12:00) Kwajalein":"Pacific/Kwajalein"},{"(GMT+12:00) Majuro":"Pacific/Majuro"}]}, "MQ":{"n":"Martinique","z":[{"(GMT-04:00) Martinique":"America/Martinique"}]}, "MR":{"n":"Mauritania","z":[{"(GMT+00:00) Nouakchott":"Africa/Nouakchott"}]}, "MU":{"n":"Mauritius","z":[{"(GMT+04:00) Mauritius":"Indian/Mauritius"}]}, "YT":{"n":"Mayotte","z":[{"(GMT+03:00) Mayotte":"Indian/Mayotte"}]}, "MX":{"n":"Mexico","z":[{"(GMT-07:00) Mountain Time - Hermosillo":"America/Hermosillo"},{"(GMT-08:00) Pacific Time - Tijuana":"America/Tijuana"},{"(GMT-07:00) Mountain Time - Chihuahua, Mazatlan":"America/Mazatlan"},{"(GMT-06:00) Central Time - Mexico City":"America/Mexico_City"}]}, "FM":{"n":"Micronesia","z":[{"(GMT+10:00) Truk":"Pacific/Truk"},{"(GMT+11:00) Kosrae":"Pacific/Kosrae"},{"(GMT+11:00) Ponape":"Pacific/Ponape"}]}, "MD":{"n":"Moldova","z":[{"(GMT+02:00) Chisinau":"Europe/Chisinau"}]}, "MC":{"n":"Monaco","z":[{"(GMT+01:00) Monaco":"Europe/Monaco"}]}, "MN":{"n":"Mongolia","z":[{"(GMT+07:00) Hovd":"Asia/Hovd"},{"(GMT+08:00) Choibalsan":"Asia/Choibalsan"},{"(GMT+08:00) Ulaanbaatar":"Asia/Ulaanbaatar"}]}, "MS":{"n":"Montserrat","z":[{"(GMT-04:00) Montserrat":"America/Montserrat"}]}, "MA":{"n":"Morocco","z":[{"(GMT+00:00) Casablanca":"Africa/Casablanca"}]}, "MZ":{"n":"Mozambique","z":[{"(GMT+02:00) Maputo":"Africa/Maputo"}]}, "MM":{"n":"Myanmar [Burma]","z":[{"(GMT+06:30) Rangoon":"Asia/Rangoon"}]}, "NA":{"n":"Namibia","z":[{"(GMT+01:00) Windhoek":"Africa/Windhoek"}]}, "NR":{"n":"Nauru","z":[{"(GMT+12:00) Nauru":"Pacific/Nauru"}]}, "NP":{"n":"Nepal","z":[{"(GMT+05:45) Katmandu":"Asia/Katmandu"}]}, "NL":{"n":"Netherlands","z":[{"(GMT+01:00) Amsterdam":"Europe/Amsterdam"}]}, "NC":{"n":"New Caledonia","z":[{"(GMT+11:00) Noumea":"Pacific/Noumea"}]}, "NZ":{"n":"New Zealand","z":[{"(GMT+12:00) Auckland":"Pacific/Auckland"}]}, "NI":{"n":"Nicaragua","z":[{"(GMT-06:00) Managua":"America/Managua"}]}, "NE":{"n":"Niger","z":[{"(GMT+01:00) Niamey":"Africa/Niamey"}]}, "NG":{"n":"Nigeria","z":[{"(GMT+01:00) Lagos":"Africa/Lagos"}]}, "NU":{"n":"Niue","z":[{"(GMT-11:00) Niue":"Pacific/Niue"}]}, "NF":{"n":"Norfolk Island","z":[{"(GMT+11:30) Norfolk":"Pacific/Norfolk"}]}, "KP":{"n":"North Korea","z":[{"(GMT+09:00) Pyongyang":"Asia/Pyongyang"}]}, "MP":{"n":"Northern Mariana Islands","z":[{"(GMT+10:00) Saipan":"Pacific/Saipan"}]}, "NO":{"n":"Norway","z":[{"(GMT+01:00) Oslo":"Europe/Oslo"}]}, "OM":{"n":"Oman","z":[{"(GMT+04:00) Muscat":"Asia/Muscat"}]}, "PK":{"n":"Pakistan","z":[{"(GMT+05:00) Karachi":"Asia/Karachi"}]}, "PW":{"n":"Palau","z":[{"(GMT+09:00) Palau":"Pacific/Palau"}]}, "PS":{"n":"Palestinian Territories","z":[{"(GMT+02:00) Gaza":"Asia/Gaza"}]}, "PA":{"n":"Panama","z":[{"(GMT-05:00) Panama":"America/Panama"}]}, "PG":{"n":"Papua New Guinea","z":[{"(GMT+10:00) Port Moresby":"Pacific/Port_Moresby"}]}, "PY":{"n":"Paraguay","z":[{"(GMT-04:00) Asuncion":"America/Asuncion"}]}, "PE":{"n":"Peru","z":[{"(GMT-05:00) Lima":"America/Lima"}]}, "PH":{"n":"Philippines","z":[{"(GMT+08:00) Manila":"Asia/Manila"}]}, "PN":{"n":"Pitcairn Islands","z":[{"(GMT-08:00) Pitcairn":"Pacific/Pitcairn"}]}, "PL":{"n":"Poland","z":[{"(GMT+01:00) Warsaw":"Europe/Warsaw"}]}, "PT":{"n":"Portugal","z":[{"(GMT-01:00) Azores":"Atlantic/Azores"},{"(GMT+00:00) Lisbon":"Europe/Lisbon"}]}, "PR":{"n":"Puerto Rico","z":[{"(GMT-04:00) Puerto Rico":"America/Puerto_Rico"}]}, "QA":{"n":"Qatar","z":[{"(GMT+03:00) Qatar":"Asia/Qatar"}]}, "RE":{"n":"Réunion","z":[{"(GMT+04:00) Reunion":"Indian/Reunion"}]}, "RO":{"n":"Romania","z":[{"(GMT+02:00) Bucharest":"Europe/Bucharest"}]}, "RU":{"n":"Russia","z":[{"(GMT+03:00) Moscow-01 - Kaliningrad":"Europe/Kaliningrad"},{"(GMT+04:00) Moscow+00":"Europe/Moscow"},{"(GMT+04:00) Moscow+00 - Samara":"Europe/Samara"},{"(GMT+06:00) Moscow+02 - Yekaterinburg":"Asia/Yekaterinburg"},{"(GMT+07:00) Moscow+03 - Omsk, Novosibirsk":"Asia/Omsk"},{"(GMT+08:00) Moscow+04 - Krasnoyarsk":"Asia/Krasnoyarsk"},{"(GMT+09:00) Moscow+05 - Irkutsk":"Asia/Irkutsk"},{"(GMT+10:00) Moscow+06 - Yakutsk":"Asia/Yakutsk"},{"(GMT+11:00) Moscow+07 - Yuzhno-Sakhalinsk":"Asia/Vladivostok"},{"(GMT+12:00) Moscow+08 - Magadan":"Asia/Magadan"},{"(GMT+12:00) Moscow+08 - Petropavlovsk-Kamchatskiy":"Asia/Kamchatka"}]}, "RW":{"n":"Rwanda","z":[{"(GMT+02:00) Kigali":"Africa/Kigali"}]}, "SH":{"n":"Saint Helena","z":[{"(GMT+00:00) St Helena":"Atlantic/St_Helena"}]}, "KN":{"n":"Saint Kitts and Nevis","z":[{"(GMT-04:00) St. Kitts":"America/St_Kitts"}]}, "LC":{"n":"Saint Lucia","z":[{"(GMT-04:00) St. Lucia":"America/St_Lucia"}]}, "PM":{"n":"Saint Pierre and Miquelon","z":[{"(GMT-03:00) Miquelon":"America/Miquelon"}]}, "VC":{"n":"Saint Vincent and the Grenadines","z":[{"(GMT-04:00) St. Vincent":"America/St_Vincent"}]}, "WS":{"n":"Samoa","z":[{"(GMT+13:00) Apia":"Pacific/Apia"}]}, "SM":{"n":"San Marino","z":[{"(GMT+01:00) Rome":"Europe/San_Marino"}]}, "ST":{"n":"São Tomé and Príncipe","z":[{"(GMT+00:00) Sao Tome":"Africa/Sao_Tome"}]}, "SA":{"n":"Saudi Arabia","z":[{"(GMT+03:00) Riyadh":"Asia/Riyadh"}]}, "SN":{"n":"Senegal","z":[{"(GMT+00:00) Dakar":"Africa/Dakar"}]}, "RS":{"n":"Serbia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Belgrade"}]}, "SC":{"n":"Seychelles","z":[{"(GMT+04:00) Mahe":"Indian/Mahe"}]}, "SL":{"n":"Sierra Leone","z":[{"(GMT+00:00) Freetown":"Africa/Freetown"}]}, "SG":{"n":"Singapore","z":[{"(GMT+08:00) Singapore":"Asia/Singapore"}]}, "SK":{"n":"Slovakia","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Bratislava"}]}, "SI":{"n":"Slovenia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Ljubljana"}]}, "SB":{"n":"Solomon Islands","z":[{"(GMT+11:00) Guadalcanal":"Pacific/Guadalcanal"}]}, "SO":{"n":"Somalia","z":[{"(GMT+03:00) Mogadishu":"Africa/Mogadishu"}]}, "ZA":{"n":"South Africa","z":[{"(GMT+02:00) Johannesburg":"Africa/Johannesburg"}]}, "GS":{"n":"South Georgia and the South Sandwich Islands","z":[{"(GMT-02:00) South Georgia":"Atlantic/South_Georgia"}]}, "KR":{"n":"South Korea","z":[{"(GMT+09:00) Seoul":"Asia/Seoul"}]}, "ES":{"n":"Spain","z":[{"(GMT+00:00) Canary Islands":"Atlantic/Canary"},{"(GMT+01:00) Ceuta":"Africa/Ceuta"},{"(GMT+01:00) Madrid":"Europe/Madrid"}]}, "LK":{"n":"Sri Lanka","z":[{"(GMT+05:30) Colombo":"Asia/Colombo"}]}, "SD":{"n":"Sudan","z":[{"(GMT+03:00) Khartoum":"Africa/Khartoum"}]}, "SR":{"n":"Suriname","z":[{"(GMT-03:00) Paramaribo":"America/Paramaribo"}]}, "SJ":{"n":"Svalbard and Jan Mayen","z":[{"(GMT+01:00) Oslo":"Arctic/Longyearbyen"}]}, "SZ":{"n":"Swaziland","z":[{"(GMT+02:00) Mbabane":"Africa/Mbabane"}]}, "SE":{"n":"Sweden","z":[{"(GMT+01:00) Stockholm":"Europe/Stockholm"}]}, "CH":{"n":"Switzerland","z":[{"(GMT+01:00) Zurich":"Europe/Zurich"}]}, "SY":{"n":"Syria","z":[{"(GMT+02:00) Damascus":"Asia/Damascus"}]}, "TW":{"n":"Taiwan","z":[{"(GMT+08:00) Taipei":"Asia/Taipei"}]}, "TJ":{"n":"Tajikistan","z":[{"(GMT+05:00) Dushanbe":"Asia/Dushanbe"}]}, "TZ":{"n":"Tanzania","z":[{"(GMT+03:00) Dar es Salaam":"Africa/Dar_es_Salaam"}]}, "TH":{"n":"Thailand","z":[{"(GMT+07:00) Bangkok":"Asia/Bangkok"}]}, "TL":{"n":"Timor-Leste","z":[{"(GMT+09:00) Dili":"Asia/Dili"}]}, "TG":{"n":"Togo","z":[{"(GMT+00:00) Lome":"Africa/Lome"}]}, "TK":{"n":"Tokelau","z":[{"(GMT+14:00) Fakaofo":"Pacific/Fakaofo"}]}, "TO":{"n":"Tonga","z":[{"(GMT+13:00) Tongatapu":"Pacific/Tongatapu"}]}, "TT":{"n":"Trinidad and Tobago","z":[{"(GMT-04:00) Port of Spain":"America/Port_of_Spain"}]}, "TN":{"n":"Tunisia","z":[{"(GMT+01:00) Tunis":"Africa/Tunis"}]}, "TR":{"n":"Turkey","z":[{"(GMT+02:00) Istanbul":"Europe/Istanbul"}]}, "TM":{"n":"Turkmenistan","z":[{"(GMT+05:00) Ashgabat":"Asia/Ashgabat"}]}, "TC":{"n":"Turks and Caicos Islands","z":[{"(GMT-05:00) Grand Turk":"America/Grand_Turk"}]}, "TV":{"n":"Tuvalu","z":[{"(GMT+12:00) Funafuti":"Pacific/Funafuti"}]}, "UM":{"n":"U.S. Minor Outlying Islands","z":[{"(GMT-11:00) Midway":"Pacific/Midway"},{"(GMT-10:00) Johnston":"Pacific/Johnston"},{"(GMT+12:00) Wake":"Pacific/Wake"}]}, "VI":{"n":"U.S. Virgin Islands","z":[{"(GMT-04:00) St. Thomas":"America/St_Thomas"}]}, "UG":{"n":"Uganda","z":[{"(GMT+03:00) Kampala":"Africa/Kampala"}]}, "UA":{"n":"Ukraine","z":[{"(GMT+02:00) Kiev":"Europe/Kiev"}]}, "AE":{"n":"United Arab Emirates","z":[{"(GMT+04:00) Dubai":"Asia/Dubai"}]}, "GB":{"n":"United Kingdom","z":[{"(GMT+00:00) GMT (no daylight saving)":"Etc/GMT"},{"(GMT+00:00) London":"Europe/London"}]}, "US":{"n":"United States","z":[{"(GMT-10:00) Hawaii Time":"Pacific/Honolulu"},{"(GMT-09:00) Alaska Time":"America/Anchorage"},{"(GMT-07:00) Mountain Time - Arizona":"America/Phoenix"},{"(GMT-08:00) Pacific Time":"America/Los_Angeles"},{"(GMT-07:00) Mountain Time":"America/Denver"},{"(GMT-06:00) Central Time":"America/Chicago"},{"(GMT-05:00) Eastern Time":"America/New_York"}]}, "UY":{"n":"Uruguay","z":[{"(GMT-03:00) Montevideo":"America/Montevideo"}]}, "UZ":{"n":"Uzbekistan","z":[{"(GMT+05:00) Tashkent":"Asia/Tashkent"}]}, "VU":{"n":"Vanuatu","z":[{"(GMT+11:00) Efate":"Pacific/Efate"}]}, "VA":{"n":"Vatican City","z":[{"(GMT+01:00) Rome":"Europe/Vatican"}]}, "VE":{"n":"Venezuela","z":[{"(GMT-04:30) Caracas":"America/Caracas"}]}, "VN":{"n":"Vietnam","z":[{"(GMT+07:00) Hanoi":"Asia/Saigon"}]}, "WF":{"n":"Wallis and Futuna","z":[{"(GMT+12:00) Wallis":"Pacific/Wallis"}]}, "EH":{"n":"Western Sahara","z":[{"(GMT+00:00) El Aaiun":"Africa/El_Aaiun"}]}, "YE":{"n":"Yemen","z":[{"(GMT+03:00) Aden":"Asia/Aden"}]}, "ZM":{"n":"Zambia","z":[{"(GMT+02:00) Lusaka":"Africa/Lusaka"}]}, "ZW":{"n":"Zimbabwe","z":[{"(GMT+02:00) Harare":"Africa/Harare"}]} };
    },

    getInitialState: function() {

        var app_id = countlyCommon.ACTIVE_APP_ID;

        this.app_categories = this.getAppCategories();
        var timezones = this.getTimeZones();

        console.log("------------------ app_categories ------------------");
        console.log(this.app_categories);
        console.log("------------------ timezones ------------------");
        console.log(timezones);

        this.timezones_options = [];

        for (var key in timezones)
        {
            var timezone = timezones[key].z[0];

            //var timezone = value.z[0];

            var timezone_key = false;
            var timezone_value = false;

            for (var key in timezone)
            {
                timezone_key = timezone[key];//key;
                timezone_value = key;//timezone[key];
                break; // it is only one value
            }

            this.timezones_options[timezone_key] = timezone_value;

/*
            this.timezones_options.push({
                "key" : timezone_key,
                "value" : timezone_value
            })*/
        }

        this.app_categories_options = [];

        for (var key in this.app_categories)
        {
            var value = this.app_categories[key];

            /*this.app_categories_options.push({
                "key" : key,
                "value" : value
            })*/

            this.app_categories_options[key] = value;
        }

        console.log("<<<<<<<<<<<<<<<<<<< options timezones_options >>>>>>>>>>>>>>>>");
        console.log(this.timezones_options);

        var current_app = countlyGlobal['apps'][app_id];
        console.log(":::::::::::::: current app :::::::::::::::");
        console.log(current_app);

        console.log("{{{{{{{{{{{ this.timezones_options }}}}}}}}}}}");
        console.log(this.timezones_options);

        return({
            current_app : current_app,
            current_app_id : app_id,
            app_list_is_open : false,
            actions_list_is_open : false
        });

        /*
        {
            for (var app in countlyGlobal['apps'])
            {
                return (<div>{app.name}</div>)
            }
        }
        */

    },

    appListClick : function(){

        this.setState({
            app_list_is_open : !this.state.app_list_is_open
        })

    },

    actionsListClick : function(){

        this.setState({
            actions_list_is_open : !this.state.actions_list_is_open
        })

    },

    selectAppClick : function(i){

        var current_app = countlyGlobal['apps'][i];

        console.log("{{{{{{{{{{{ current app }}}}}}}}}}}");
        console.log(current_app);

        this.setState({
            current_app : current_app,
            current_app_id : current_app._id,
            app_list_is_open : false
        });

    },

    saveApp : function(props, state){

        console.log("========== current_app ===========");
        console.log(this.state.current_app);
        console.log("==== click state ============");
        console.log(state);
        console.log("==== click props ============");
        console.log(props);

        var updated_app = this.state.current_app;

        if (state.value_key)
        {
            updated_app[props.save_key] = state.value_key;
        }
        else {
            updated_app[props.save_key] = state.value;
        }

        console.log("=========== updated_app ===============");
        console.log(updated_app);

/*
        $("#save-app-edit").click(function () {
            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appId = $("#app-edit-id").val(),
                appName = $("#app-edit-name .edit input").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-edit-name .edit input").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-edit-image-form').find("#app_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");
*/

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/update',
                data:{
                    args:JSON.stringify({
                        app_id:updated_app._id,
                        name:updated_app.name,
                        category:updated_app.category,
                        timezone:updated_app.timezone,
                        country:"CN" // todo!!
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (data) {

                    console.log("========= saved ==============");
                    console.log(data);

                  /*
                    for (var modAttr in data) {
                        countlyGlobal['apps'][appId][modAttr] = data[modAttr];
                        countlyGlobal['admin_apps'][appId][modAttr] = data[modAttr];
                    }

                    if (!ext) {
                        $("#save-app-edit").removeClass("disabled");
                        initAppManagement(appId);
                        hideEdit();
                        $(".app-container").filter(function () {
                            return $(this).data("id") && $(this).data("id") == appId;
                        }).find(".name").text(appName);

                        var sidebarLogo = $("#sidebar-app-select .logo").attr("style");
                        if (sidebarLogo.indexOf(appId) !== -1) {
                            $("#sidebar-app-select .text").text(appName);
                        }
                        return true;
                    }

                    $('#add-edit-image-form').find("#app_image_id").val(appId);
                    $('#add-edit-image-form').ajaxSubmit({
                        resetForm:true,
                        beforeSubmit:function (formData, jqForm, options) {
                            formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                        },
                        success:function (file) {
                            $("#save-app-edit").removeClass("disabled");
                            var updatedApp = $(".app-container").filter(function () {
                                return $(this).data("id") && $(this).data("id") == appId;
                            });

                            if (!file) {
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                            } else {
                                updatedApp.find(".logo").css({
                                    "background-image":"url(" + file + "?v" + (new Date().getTime()) + ")"
                                });
                                $("#sidebar-app-select .logo").css("background-image", $("#sidebar-app-select .logo").css("background-image").replace(")","") + "?v" + (new Date().getTime()) + ")");
                            }

                            initAppManagement(appId);
                            hideEdit();
                            updatedApp.find(".name").text(appName);
                        }
                    });

                    */
                }
            });

        /*});
*/
    },

    clearData : function(){

        var current_app = this.state.current_app;

        return false;

        CountlyHelpers.confirm(jQuery.i18n.map["management-applications.clear-confirm"], "red", function (result) {
            if (!result) {
                return true;
            }

            var appId = current_app._id;

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/reset',
                data:{
                    args:JSON.stringify({
                        app_id:appId,
                        period:period
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (result) {

                    if (!result) {
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-admin"], "red");
                        return false;
                    } /*else {
                        if(period == "all"){
                            countlySession.reset();
                            countlyLocation.reset();
                            countlyCity.reset();
                            countlyUser.reset();
                            countlyDevice.reset();
                            countlyCarrier.reset();
                            countlyDeviceDetails.reset();
                            countlyAppVersion.reset();
                            countlyEvent.reset();
                        }
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-success"], "black");
                    }*/
                }
            });
        });
    },

    deleteApp : function()
    {

        var self = this;

        console.log("=============== delte current app =================");
        console.log(self.state.current_app);

        //var current_app = this.state.current_app;

        CountlyHelpers.confirm(jQuery.i18n.map["management-applications.delete-confirm"], "red", function (result) {

            if (!result) {
                return true;
            }

            var appId = self.state.current_app._id;

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/delete',
                data:{
                    args:JSON.stringify({
                        app_id:appId
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function () {

                    console.log("============ countlyGlobal['apps'] ===============");
                    console.log(countlyGlobal['apps']);

                    delete countlyGlobal['apps'][appId];
                    delete countlyGlobal['admin_apps'][appId];

                    var current_app = false/*countlyGlobal['apps'][0]*/;

                    for (var app_id in countlyGlobal['apps'])
                    {
                        current_app = countlyGlobal['apps'][app_id];
                        break;
                    }

                    console.log("{{{{{{{{{{{ current app }}}}}}}}}}}");
                    console.log(current_app);

                    self.setState({
                        current_app : current_app,
                        current_app_id : current_app._id,
                        actions_list_is_open : false
                    });

                    /*
                    var activeApp = $(".app-container").filter(function () {
                        return $(this).data("id") && $(this).data("id") == appId;
                    });

                    var changeApp = (activeApp.prev().length) ? activeApp.prev() : activeApp.next();
                    initAppManagement(changeApp.data("id"));
                    activeApp.fadeOut("slow").remove();

                    if (_.isEmpty(countlyGlobal['apps'])) {
                        $("#new-install-overlay").show();
                        $("#sidebar-app-select .logo").css("background-image", "");
                        $("#sidebar-app-select .text").text("");
                    }*/
                },
                error:function () {
                    CountlyHelpers.alert(jQuery.i18n.map["management-applications.delete-admin"], "red");
                }
            });
        });

    },

    render : function(){

        var self = this;

        var sidebar_width = 240;
        var margin_left   = 40;
        var margin_right  = 30;

        var page_width = window.innerWidth - sidebar_width - margin_left - margin_right;

        var page_style = {
            width : page_width
        }

        var app_list_style = {}

        if (this.state.app_list_is_open)
        {
            app_list_style.display = "block";
        }
        else {
            app_list_style.display = "none";
        }

        var actions_list_style = {};

        if (this.state.actions_list_is_open)
        {
            actions_list_style.display = "block";
        }
        else {
            actions_list_style.display = "none";
        }

        var icon_style = {};

        icon_style["background-image"] = "url('appimages/" + this.state.current_app._id + ".png')";

        var selector_logo_style = {
            "background-image" : "url('appimages/" + this.state.current_app._id + ".png')"
        }

        return (
            <div id="applications_page" style={page_style}>

                <div className="top_block">
                    <span className="sign">APPLICATIONS MANAGEMENT</span>
                    <div className="new_app_button">Add New App</div>
                </div>

                <div className="wrapper">

                    <div className="selectors_block">

                        <div className="application_selector">
                            <div className="open_button" onClick={this.appListClick.bind(this)}>
                                <div className="logo" style={selector_logo_style}></div>
                                <div className="name">{this.state.current_app.name}</div>
                                <div className="arrow"></div>
                            </div>
                            <div className="app_list" style={app_list_style}>
                                {
                                    _.map(countlyGlobal['apps'], function(app, i){

                                        return (<div onClick={self.selectAppClick.bind(self, i)}>{app.name}</div>)

                                    })
                                }
                            </div>
                        </div>

                        <div className="action_selector">
                            <div className="open_button" onClick={this.actionsListClick.bind(this)}>
                                <div className="sign">Action</div>
                                <div className="arrow"></div>
                            </div>
                            <div className="actions_list" style={actions_list_style}>
                                <div onClick={this.deleteApp.bind(this)}>Delete App</div>
                                <div onClick={this.clearData.bind(this)}>Clear Data</div>
                            </div>
                        </div>

                    </div>

                    <div className="application_block">

                        <span className="sign">APPLICATION DATA</span>

                        <div className="info_block">
                            <div className="table">
                                <span className="row">
                                    <span className="key">App ID</span>
                                    <span className="value">{this.state.current_app._id}</span>
                                </span>

                                <EditableField value_key={"App Name"} value={this.state.current_app.name} on_save={this.saveApp} save_key="name"/>

                                <span className="row">
                                    <span className="key">App Key</span>
                                    <span className="value">{this.state.current_app.key}</span>
                                </span>

                                <EditableField value_key={"Category"} value={this.state.current_app.category} options_values={this.app_categories_options} on_save={this.saveApp} save_key="category"/>

                                <EditableField value_key={"Time Zone"} value={this.state.current_app.timezone} options_values={this.timezones_options} on_save={this.saveApp} save_key="timezone"/>

                                <span className="row">
                                    <span className="key">IAP Event Key</span>
                                    <span className="value">101010test1010101</span>
                                </span>
                            </div>

                            <div className="icon_block">
                                <span className="sign">Icon</span>
                                <div className="icon" style={icon_style}></div>
                            </div>

                        </div>

                        <div className="sdk_block">
                            <span className="sign">Run Countly SDKs</span>
                            <span className="description">Countly has several SDKs to choose from. Some of them are supported by Countly, and others are contributed by Countly community.</span>
                            <a href="https://github.com/countly" className="button">Explore at Github</a>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});
