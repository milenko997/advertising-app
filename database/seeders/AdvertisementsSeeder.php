<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Services\SlugService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AdvertisementsSeeder extends Seeder
{
    public function run()
    {
        $users     = User::where('role', 'customer')->pluck('id')->toArray();
        $catByName = Category::pluck('id', 'name')->toArray();

        $locations = [
            'Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica',
            'Zrenjanin', 'Pančevo', 'Čačak', 'Kraljevo', 'Leskovac',
            'Valjevo', 'Smederevo', 'Kruševac', 'Šabac', 'Sombor',
            'Požarevac', 'Vranje', 'Zaječar', 'Užice', 'Kikinda',
        ];

        $ads = [

            // ── Šleperi (tegljač + poluprikolica) ───────────────────
            [
                'title'       => 'Mercedes-Benz Actros 1845 LS — šleper sa mega prikolicom',
                'category'    => 'Šleperi (tegljač + poluprikolica)',
                'price'       => '52.000 €',
                'payload'     => '24.000 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0641234567',
                'description' => "Prodajem Mercedes-Benz Actros 1845 LS, godište 2019, pređeno 620.000 km. Vozilo je u odličnom tehničkom stanju, redovno servisiran u ovlašćenom servisu. Opremljen Stream Space kabinom, automatskim menjačem i sistemom za kontrolu rasporeda opterećenja.\n\nPrikolica: Schmitz Cargobull 2018, mega verzija (visina 3 metra), cela renovirana i u ispravnom stanju. ADR sertifikat važeći do kraja godine.\n\nMogućnost dogovora oko cene za ozbiljne kupce. Vozilo se može pogledati u Beogradu, dogovorom. Nije hitna prodaja.",
                'is_pinned'   => true,
                'views'       => 342,
            ],
            [
                'title'       => 'Volvo FH 500 4x2 — tegljač sa hladnjačom, odličan',
                'category'    => 'Šleperi (tegljač + poluprikolica)',
                'price'       => '61.000 €',
                'payload'     => '22.000 kg',
                'availability'=> 'available',
                'location'    => 'Novi Sad',
                'phone'       => '0652345678',
                'description' => "Volvo FH 500 4x2, godište 2020, 480.000 km. I-Save tehnologija — ušteda goriva do 7%. Globetrotter XL kabina sa ležajevima i svim komfornim opcijama.\n\nHladnjača Thermoking SLXi 400, 2019. godište, rashladni agregat u perfektnom stanju, temperatura od -25°C do +25°C.\n\nVozilo prošlo kompletan servis pre prodaje — svi filteri, ulje, kočne pločice zamenjeni. Dostupno odmah.",
                'is_pinned'   => false,
                'views'       => 218,
            ],
            [
                'title'       => 'DAF XF 460 FT Super Space Cab — prodaja ili zamena',
                'category'    => 'Šleperi (tegljač + poluprikolica)',
                'price'       => '44.500 €',
                'payload'     => '25.000 kg',
                'availability'=> 'available',
                'location'    => 'Kragujevac',
                'phone'       => '0603456789',
                'description' => "DAF XF 460 FT, 2017. godište, pređeno 890.000 km. Motor u odličnom stanju, engine brake u funkciji. Super Space kabina sa velikim ležajevima.\n\nUz vozilo ide standardna cerađa prikolica Kögel 2017., generalni gabarit, u ispravnom stanju sa važećom ADR dozvolom.\n\nMoguća zamena za mlađe vozilo uz doplatu. Cena je fiksna, bez posrednika molim.",
                'is_pinned'   => false,
                'views'       => 156,
            ],
            [
                'title'       => 'MAN TGX 18.480 4x2 BLS — tegljač za duže relacije',
                'category'    => 'Šleperi (tegljač + poluprikolica)',
                'price'       => '57.000 €',
                'payload'     => '24.500 kg',
                'availability'=> 'on_request',
                'location'    => 'Subotica',
                'phone'       => '0674567890',
                'description' => "MAN TGX 18.480, 2021. godište, svega 310.000 km. Vozilo u garantnom roku, servisna knjiga kompletna. EfficientCruise i EfficientRoll sistemi.\n\nXXL kabina sa panoramskim prozorom, hladnjak, mikrotalasna. Opremljeno za duže relacije EU transporta.\n\nVozilo je trenutno u upotrebi i može biti dostupno u roku od 2 sedmice. Ozbiljne ponude putem telefona.",
                'is_pinned'   => false,
                'views'       => 94,
            ],

            // ── Hladnjače - veliki kamioni ───────────────────────────
            [
                'title'       => 'Schmitz Cargobull hladnjača 2020 — odlično stanje',
                'category'    => 'Hladnjače - veliki kamioni',
                'price'       => '28.500 €',
                'payload'     => '20.000 kg',
                'availability'=> 'available',
                'location'    => 'Niš',
                'phone'       => '0615678901',
                'description' => "Prodajem poluprikolicu-hladnjaču Schmitz Cargobull S.KO Cool, godište 2020, pređeno samo 180.000 km u transportu.\n\nRashladni agregat Carrier Supra 1150MT, 2019. godište — u perfektnom stanju. Radni temperaturni raspon: -30°C do +25°C. Višetemperaturna pregrada uključena.\n\nAlu pod, zadnje i bočne zavese, GPS praćenje ugrađeno. Svi papiri uredni, bez dugova.",
                'is_pinned'   => false,
                'views'       => 187,
            ],
            [
                'title'       => 'Frigo kamion Renault Premium 2016 — hladnjača 18t',
                'category'    => 'Hladnjače - veliki kamioni',
                'price'       => '31.000 €',
                'payload'     => '14.000 kg',
                'availability'=> 'available',
                'location'    => 'Pančevo',
                'phone'       => '0626789012',
                'description' => "Renault Premium 430 DXI sa nadgradnjom hladnjačom, 2016. godište, 740.000 km. Motor redovno servisiran, u ispravnom stanju.\n\nHladnjačka nadgradnja Lamberet, rashladni agregat Thermoking, servisiran i u funkciji. Temperatura od -22°C do +12°C.\n\nIdealno za dostavu prehrambenih proizvoda na kratkim i srednjim relacijama. Cena po dogovoru za hitnu prodaju.",
                'is_pinned'   => false,
                'views'       => 203,
            ],

            // ── Kamioni sa ceradom (tenda) ───────────────────────────
            [
                'title'       => 'Kamion sa ceradom Mercedes Atego 1224 — idealan za dostavu',
                'category'    => 'Kamioni sa ceradom (tenda)',
                'price'       => '22.000 €',
                'payload'     => '8.000 kg',
                'availability'=> 'available',
                'location'    => 'Čačak',
                'phone'       => '0637890123',
                'description' => "Mercedes-Benz Atego 1224, 2017. godište, 420.000 km. Namenjen za regionalne i lokalne relacije transporta paleta i generalnog tereta.\n\nNadgradnja: cerađa sa aluminijumskim podom i bočnim zavesama, korisna dužina 7,2m. Hiabl dizalica 026 na krovu kabine.\n\nVozač prostor klimatizovan, tahograf digitalan, tahografski listić uredan. Vozilo prošlo tehnički pregled do kraja godine.",
                'is_pinned'   => false,
                'views'       => 128,
            ],
            [
                'title'       => 'MAN TGL 12.220 cerađa — servisiran, spreman za rad',
                'category'    => 'Kamioni sa ceradom (tenda)',
                'price'       => '19.500 €',
                'payload'     => '7.500 kg',
                'availability'=> 'available',
                'location'    => 'Kraljevo',
                'phone'       => '0648901234',
                'description' => "MAN TGL 12.220 4x2 BL, godište 2016, 510.000 km. Ručni menjač, motor u odličnom stanju. Redovno servisiran.\n\nNadgradnja cerađa Kögel, dužina 7,5m, sa punim bočnim otvaranjem i alu letvicama poda. Vozilo dolazi sa kompletnom opremom za osiguranje tereta.\n\nNema vidljivih oštećenja na kabini. Idealno za firme u ekspanziji.",
                'is_pinned'   => false,
                'views'       => 97,
            ],

            // ── Kamioni kiperi ───────────────────────────────────────
            [
                'title'       => 'Kiper Mercedes Actros 3341 6x4 — građevinski, odličan',
                'category'    => 'Kiperi - teški građevinski',
                'price'       => '48.000 €',
                'payload'     => '18.000 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0659012345',
                'description' => "Mercedes-Benz Actros 3341 6x4, godište 2018, pređeno 380.000 km. Kiper sanduk 16 kubika, hidraulika u ispravnom stanju.\n\nVozilo korišćeno na građevinskim projektima, redovno servisiran, nema mehaničkih problema. Gume 70% ispravne.\n\nMoguće razgledanje u Zemunu u radno vreme. Za detalje i video zovite.",
                'is_pinned'   => false,
                'views'       => 144,
            ],
            [
                'title'       => 'Volvo FMX 460 8x4 kiper — šahtni ili zemlja',
                'category'    => 'Kiperi - teški građevinski',
                'price'       => '67.000 €',
                'payload'     => '22.000 kg',
                'availability'=> 'on_request',
                'location'    => 'Smederevo',
                'phone'       => '0660123456',
                'description' => "Volvo FMX 460 8x4, godište 2021, 210.000 km. Vozilo u gotovo novom stanju, korišćeno na autoputu Beograd-Sarajevo.\n\nKiper sanduk Meiller 18m³, automatska pokrivka, višestruka regulacija hidraulike. Terenska verzija sa off-road gumama.\n\nSve redovne provere urađene, motor i menjač garantovani. Cena je poslednja — bez pregovora.",
                'is_pinned'   => true,
                'views'       => 276,
            ],

            // ── Kamioni sandučari ─────────────────────────────────────
            [
                'title'       => 'Iveco Daily 35S18 sandučar — savršen za dostavu',
                'category'    => 'Kamioni sandučari',
                'price'       => '16.500 €',
                'payload'     => '1.200 kg',
                'availability'=> 'available',
                'location'    => 'Novi Sad',
                'phone'       => '0671234567',
                'description' => "Iveco Daily 35S18 sandučar, 2019. godište, 95.000 km. Odlično vozilo za dostavu paketa i manjih pošiljki u gradskim uslovima.\n\nSanduk dimenzije 3,5×2,0×2,1m, hidraulična rampa 600 kg. Klima, putni računar, automatski menjač.\n\nBez ikakvih oštećenja, ceo u originalnoj farbi. Servisna knjiga kompletna. Može se videti u Novom Sadu.",
                'is_pinned'   => false,
                'views'       => 112,
            ],
            [
                'title'       => 'Mercedes Sprinter 316 sandučar 2018 — garancija',
                'category'    => 'Kamioni sandučari',
                'price'       => '14.800 €',
                'payload'     => '1.100 kg',
                'availability'=> 'available',
                'location'    => 'Kragujevac',
                'phone'       => '0682345678',
                'description' => "Mercedes-Benz Sprinter 316 CDI sandučar, 2018, 148.000 km. Vozilo servisirano isključivo u Mercedesovom servisu — knjiga kompletna.\n\nVisoki sanduk 2,4m, unutrašnjost obložena antikorozivnom oblogom. Povišeni plafon sa LED rasvjetom.\n\nMoguće finansiranje. Vozilo je registrovano do aprila naredne godine.",
                'is_pinned'   => false,
                'views'       => 89,
            ],

            // ── Kombi vozila ──────────────────────────────────────────
            [
                'title'       => 'Ford Transit Custom 2020 — panel van, odličan',
                'category'    => 'Kombi (panel van)',
                'price'       => '18.500 €',
                'payload'     => '1.300 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0693456789',
                'description' => "Ford Transit Custom 2.0 TDCI L2, 2020. godište, 87.000 km. Vozilo u odličnom stanju, bez oštećenja karoserije.\n\nDugačka verzija teretnog prostora, foliran pod, bočne police. Klima, tempomat, parking senzori pozadi.\n\nJedno vlasništvo od novog. Idealno za kurirske i dostavljačke kompanije.",
                'is_pinned'   => false,
                'views'       => 231,
            ],
            [
                'title'       => 'Volkswagen Crafter 35 2.0 TDI — Kombi za iznajmljivanje',
                'category'    => 'Kombi (panel van)',
                'price'       => null,
                'payload'     => '1.500 kg',
                'availability'=> 'on_request',
                'location'    => 'Niš',
                'phone'       => '0614567890',
                'description' => "Iznajmljujem VW Crafter 35 2.0 TDI, 2021. godište — cena na mesečnoj bazi uz dogovor.\n\nVozilo dostupno za dugoročni najam (minimum 3 meseca). Osiguranje uključeno, redovan servis na našem trošku. Moguć i kratkoročni najam za sezonske potrebe.\n\nZovite za detalje i dostupnost. Vozilo se nalazi u Nišu.",
                'is_pinned'   => false,
                'views'       => 167,
            ],
            [
                'title'       => 'Renault Trafic 1.6 DCI panel van — malo kilometara',
                'category'    => 'Kombi (panel van)',
                'price'       => '11.200 €',
                'payload'     => '900 kg',
                'availability'=> 'available',
                'location'    => 'Šabac',
                'phone'       => '0625678901',
                'description' => "Renault Trafic L2H1 1.6 dCi, 2018. godište, samo 64.000 km. Odlično stanje, redovno servisiran u ovlašćenom servisu.\n\nPanel van bez zadnjih sedišta, čist teretni prostor 2,5m dužine. Klima, Bluetooth, centralno zaključavanje.\n\nBez saobraćajnih nesreća. Cena dogovorljiva za ozbiljne kupce.",
                'is_pinned'   => false,
                'views'       => 145,
            ],

            // ── Pickup vozila ─────────────────────────────────────────
            [
                'title'       => 'Toyota Hilux 2.4 D-4D 4x4 2019 — servisiran',
                'category'    => 'Pickup vozila',
                'price'       => '27.000 €',
                'payload'     => '1.000 kg',
                'availability'=> 'available',
                'location'    => 'Leskovac',
                'phone'       => '0641234567',
                'description' => "Toyota Hilux Extra Cab 2.4 D-4D 4x4, godište 2019, 112.000 km. Jedno vlasništvo, servis isključivo u Toyota centru — sve u servisu.\n\nTehničko: hill start assist, VSC, downhill assist. Zaštita motora i kutija ispod vozila. Kuka za prikolicu.\n\nIdealano za transport u teškim terenskim uslovima. Vozilo se može videti u Leskovcu.",
                'is_pinned'   => false,
                'views'       => 198,
            ],

            // ── Cisterne ─────────────────────────────────────────────
            [
                'title'       => 'Cisterna za gorivo 25.000 L — Mercedes Actros 2016',
                'category'    => 'Cisterne (gorivo, gas, hemikalije)',
                'price'       => '55.000 €',
                'payload'     => '18.000 kg',
                'availability'=> 'available',
                'location'    => 'Zrenjanin',
                'phone'       => '0652345678',
                'description' => "Prodajem kamion-cisternu za gorivo na bazi Mercedes-Benz Actros 2548, godište 2016, 640.000 km.\n\nCisterna zapremina 25.000 litara, ADR klasa 3 sertifikat važeći, 5 komora, pumpa brojač. Sve relevantne dozvole.",
                'is_pinned'   => false,
                'views'       => 122,
            ],

            // ── Auto-transporter ──────────────────────────────────────
            [
                'title'       => 'Auto-transporter za 6 vozila — MAN TGS 2018',
                'category'    => 'Auto-transporter (za vozila)',
                'price'       => '72.000 €',
                'payload'     => '10.000 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0603456789',
                'description' => "MAN TGS 26.440 sa dvoetažnim auto-transporterom za 6 putničkih vozila, godište 2018, 290.000 km.\n\nPrikolica Rolfo, 2018. godište. Hidraulični sistem za podizanje gornje rampe. Kapacitet: 6 vozila do klase D.\n\nVozilo se koristi za transport sa autopijaca. Kompletna dokumentacija, ADR servis. Ozbiljne ponude samo.",
                'is_pinned'   => false,
                'views'       => 89,
            ],

            // ── Bageri ───────────────────────────────────────────────
            [
                'title'       => 'Bager JCB 3CX ECO 2019 — kompletno servisiran',
                'category'    => 'Bageri',
                'price'       => '38.000 €',
                'payload'     => null,
                'availability'=> 'available',
                'location'    => 'Valjevo',
                'phone'       => '0674567890',
                'description' => "JCB 3CX ECO bager-utovarivač, godište 2019, 3.800 radnih sati. Servisiran po JCB rasporedu, sva dokumentacija.\n\nKomanda ISO, klimatizovana kabina, gume 70%. Kašika stražnja 0,3m³, prednja lopata 1,1m³.\n\nVozilo se može testirati na licu mesta. Idealno za male i srednje građevinske projekte.",
                'is_pinned'   => false,
                'views'       => 176,
            ],
            [
                'title'       => 'Caterpillar 320D GC bager 2017 — odlično stanje',
                'category'    => 'Bageri',
                'price'       => '58.000 €',
                'payload'     => null,
                'availability'=> 'available',
                'location'    => 'Kragujevac',
                'phone'       => '0615678901',
                'description' => "Caterpillar 320D GC, godište 2017, 6.200 radnih sati. Jedan vlasnik, korišćen isključivo na putnoj infrastrukturi.\n\nHidraulični čekić adaptacija prisutna. Cat Grade Control 2D sistema ugrađen. Gusenice 80% ispravne.\n\nCat sertifikat pregleda dostupan. Cena je fiksna, bez posrednika.",
                'is_pinned'   => true,
                'views'       => 312,
            ],

            // ── Mini bageri ───────────────────────────────────────────
            [
                'title'       => 'Mini bager Kubota KX016-4 2020 — mali sati',
                'category'    => 'Mini bageri',
                'price'       => '19.000 €',
                'payload'     => null,
                'availability'=> 'available',
                'location'    => 'Novi Sad',
                'phone'       => '0626789012',
                'description' => "Kubota KX016-4, godište 2020, samo 1.200 radnih sati. Idealan za komunalne radove, instalacije, vrtove.\n\nŠirina 1,5m, može ući kroz standardna vrata. Gumene gusenice, okretna platforma 360°.\n\nVlasnik kupio novo, prodaje ovaj. Servisna knjiga kompletna. Bez pregovaranja.",
                'is_pinned'   => false,
                'views'       => 134,
            ],

            // ── Električna dostavna vozila ────────────────────────────
            [
                'title'       => 'Renault Kangoo Z.E. električni dostavljač 2021',
                'category'    => 'Električna dostavna vozila',
                'price'       => '13.500 €',
                'payload'     => '640 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0637890123',
                'description' => "Renault Kangoo Z.E. 33 kWh, godište 2021, 38.000 km. Baterija u odličnom stanju — kapacitet 92% originalnog.\n\nDomašaj do 200 km u gradskim uslovima. Punjenje: brzo punjenje CCS do 22 kW, kućni punjač uključen.\n\nIdealano za gradsku dostavu bez troškova goriva. Subvencija za EV moguća.",
                'is_pinned'   => false,
                'views'       => 267,
            ],

            // ── Teretni vagoni ────────────────────────────────────────
            [
                'title'       => 'Teretni vagon za žitarice — kapacitet 60t',
                'category'    => 'Teretni vagoni',
                'price'       => '24.000 €',
                'payload'     => '60.000 kg',
                'availability'=> 'on_request',
                'location'    => 'Subotica',
                'phone'       => '0648901234',
                'description' => "Prodajem teretni železnički vagon za sipki rasuti teret (žitarice, miner. đubrivo), kapacitet 60 tona.\n\nVagon u ispravnom stanju, prošao poslednju atestaciju 2023. godine. Moguć zakup na duži period.\n\nKontaktirajte za tehničke detalje i vizualni pregled.",
                'is_pinned'   => false,
                'views'       => 43,
            ],

            // ── Specijalni transport ──────────────────────────────────
            [
                'title'       => 'Vučno vozilo za šlep službu — Mercedes Sprinter 519',
                'category'    => 'Šlep služba (vučna vozila)',
                'price'       => '29.000 €',
                'payload'     => null,
                'availability'=> 'available',
                'location'    => 'Niš',
                'phone'       => '0659012345',
                'description' => "Mercedes-Benz Sprinter 519 CDI šlep vozilo, 2019. godište, 187.000 km. Opremljeno za šlep službu — hidraulična platforma, dizalica prednja.\n\nOprema: Goldhofer platforma 5x2m, 24V osvjetljenje signalizacije, kamera za praćenje.\n\nVozilo u svakodnevnoj upotrebi — prodaja zbog nabavke novog. Cena fiksna.",
                'is_pinned'   => false,
                'views'       => 88,
            ],
            [
                'title'       => 'Vozilo za prevoz stoke — Scania R450 2017',
                'category'    => 'Vozila za prevoz stoke',
                'price'       => '46.000 €',
                'payload'     => '14.000 kg',
                'availability'=> 'available',
                'location'    => 'Pančevo',
                'phone'       => '0660123456',
                'description' => "Scania R450 LA 4x2 MNA sa dvoetažnom nadgradnjom za prevoz stoke (goveda/svinje), godište 2017, 510.000 km.\n\nNadgradnja Pezzaioli, 2 etaže, ventilacija, sistem napajanja vodom. ADR i veterinarska dozvola.\n\nVozač prostor sa spavaćim prostorom, klima, sve ispravno. Vozilo je u aktivnoj upotrebi.",
                'is_pinned'   => false,
                'views'       => 65,
            ],

            // ── Kamioni sa dizalicom ──────────────────────────────────
            [
                'title'       => 'Kamion sa kranom Fassi F170 — Iveco Stralis 2016',
                'category'    => 'Kamioni sa dizalicom (kran)',
                'price'       => '37.500 €',
                'payload'     => '9.000 kg',
                'availability'=> 'available',
                'location'    => 'Požarevac',
                'phone'       => '0671234567',
                'description' => "Iveco Stralis 260S36 sa kranom Fassi F170A.0.24, godište 2016, 430.000 km.\n\nDoseg krana 14m, kapacitet 5t na 3m. Daljinski upravljač, stabilizatori sa podnim pločama.\n\nKorišćen za transport gradjevinskog materijala i industrijske opreme. Sve atestacije krana važeće.",
                'is_pinned'   => false,
                'views'       => 154,
            ],

            // ── Traktori sa prikolicom ────────────────────────────────
            [
                'title'       => 'John Deere 6130R 2018 sa prikolicom — set',
                'category'    => 'Traktori sa prikolicom',
                'price'       => '62.000 €',
                'payload'     => '8.000 kg',
                'availability'=> 'available',
                'location'    => 'Zrenjanin',
                'phone'       => '0682345678',
                'description' => "John Deere 6130R, godište 2018, 3.800 radnih sati. Komfort Plus kabina, AutoTrac Ready, IVT menjač.\n\nPrikolica Joskin Cargo-Track 8T, 2019. godište — hidraulično skidanje tereta. Korišćeno za prevoz pšenice i kukuruza.\n\nSet je u kompletu, možete kupiti samo traktor ako prikolica nije potrebna. Cena po dogovoru.",
                'is_pinned'   => false,
                'views'       => 108,
            ],

            // ── Gradska dostava ───────────────────────────────────────
            [
                'title'       => 'Opel Vivaro 1.6 CDTI dostavno vozilo 2020',
                'category'    => 'Gradska dostava (mali kombi)',
                'price'       => '12.900 €',
                'payload'     => '1.000 kg',
                'availability'=> 'available',
                'location'    => 'Beograd',
                'phone'       => '0693456789',
                'description' => "Opel Vivaro L2 1.6 CDTI BiTurbo, 2020. godište, 72.000 km. Servis urađen — novi filteri, nova kaiš distribucije.\n\nKlima, MediaNav navigacija, parking kamera. Teretni prostor 5,2m³, nosivost 1.000 kg.\n\nRegistrovan do novembra. Mogućnost gledanja tokom dana u Beogradu.",
                'is_pinned'   => false,
                'views'       => 193,
            ],
            [
                'title'       => 'Peugeot Boxer 2.2 HDI panel van — mali km',
                'category'    => 'Gradska dostava (mali kombi)',
                'price'       => '10.800 €',
                'payload'     => '1.200 kg',
                'availability'=> 'available',
                'location'    => 'Kruševac',
                'phone'       => '0614567890',
                'description' => "Peugeot Boxer L2H2 2.2 HDi 130 KS, 2019. godište, 83.000 km. Bez oštećenja, redovno servisiran.\n\nVisoki krov 2,5m iznutra, dužina 3,3m. Čist teretni prostor. Ventilacioni krov, bočna klizna vrata.\n\nVozilo firme koja se gasi. Cena je dogovorljiva za brzu kupovinu.",
                'is_pinned'   => false,
                'views'       => 77,
            ],

            // ── Utovarivači ───────────────────────────────────────────
            [
                'title'       => 'Utovarivač Komatsu WA200-7 2016 — odlično stanje',
                'category'    => 'Utovarivači',
                'price'       => '42.000 €',
                'payload'     => null,
                'availability'=> 'available',
                'location'    => 'Vranje',
                'phone'       => '0625678901',
                'description' => "Komatsu WA200-7 utovarivač, 2016. godište, 6.800 radnih sati. Korišćen na kamenolomu.\n\nKašika 1,7m³, automatski menjač, ROPS/FOPS kabina. Gume 60% ispravne.\n\nPunu servisnu dokumentaciju od Komatsu Serbia. Moguć obilazak i probna vožnja.",
                'is_pinned'   => false,
                'views'       => 87,
            ],

            // ── Hladnjače mali kombi ──────────────────────────────────
            [
                'title'       => 'Hladnjača kombi Fiat Ducato 2019 — dostava hrane',
                'category'    => 'Hladnjače - mali kombi',
                'price'       => '15.500 €',
                'payload'     => '800 kg',
                'availability'=> 'available',
                'location'    => 'Sombor',
                'phone'       => '0641234567',
                'description' => "Fiat Ducato L3H2 2.3 Multijet hladnjačica, godište 2019, 108.000 km. Rashladni agregat Frigoblock, temperatura od -20°C.\n\nIdealno za dostavu mesa, mlečnih proizvoda, lekova. Unutrašnjost od nerđajućeg čelika, lako se čisti.\n\nRedovan servis, tahograf digitalni, vozilo ispravno i u funkciji.",
                'is_pinned'   => false,
                'views'       => 142,
            ],

            // ── Kamioni sa prikolicom ─────────────────────────────────
            [
                'title'       => 'Vlak (kamion + prikolica) Volvo FM 2015 — 25 tona',
                'category'    => 'Kamioni sa prikolicom',
                'price'       => '39.000 €',
                'payload'     => '25.000 kg',
                'availability'=> 'on_request',
                'location'    => 'Zaječar',
                'phone'       => '0652345678',
                'description' => "Volvo FM 410 6x2 sa trodosovnom prikolicom, godište 2015/2014, zajedno 1.100.000 km.\n\nPrikolica Schwarzmüller 3-osovinska, cerađa sa bočnim zavesama. Motor Volvo D13 prošao generalni remont 2022.\n\nProdaja kao set ili odvojeno. Cena za set, za odvojeno dogovorite se telefonom.",
                'is_pinned'   => false,
                'views'       => 131,
            ],

            // ── Ekspres dostava ───────────────────────────────────────
            [
                'title'       => 'Dostavljačko vozilo Citroen Jumpy XL — 2021',
                'category'    => 'Ekspres dostava',
                'price'       => '17.200 €',
                'payload'     => '1.100 kg',
                'availability'=> 'available',
                'location'    => 'Kikinda',
                'phone'       => '0603456789',
                'description' => "Citroen Jumpy XL 2.0 HDi 120 KS, godište 2021, 61.000 km. Vozilo u perfektnom stanju, jedan vlasnik.\n\nDugačka verzija L3, teretni prostor 6.1m³, klizna bočna vrata sa obe strane. Klima, kamera unazad.\n\nRegistrovan do juna. Korišćen za ekspres pošiljke. Mogućnost finansiranja.",
                'is_pinned'   => false,
                'views'       => 116,
            ],

        ];

        foreach ($ads as $data) {
            $catId  = $catByName[$data['category']] ?? null;
            $userId = $users[array_rand($users)];

            Advertisement::create([
                'user_id'      => $userId,
                'category_id'  => $catId,
                'title'        => $data['title'],
                'slug'         => SlugService::generate($data['title']),
                'description'  => $data['description'],
                'price'        => $data['price'] ?? null,
                'payload'      => $data['payload'] ?? null,
                'availability' => $data['availability'],
                'phone'        => $data['phone'],
                'location'     => $data['location'],
                'is_pinned'    => $data['is_pinned'],
                'views'        => $data['views'],
                'expires_at'   => now()->addDays(rand(5, 60)),
            ]);
        }
    }
}
