<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Category::query()->forceDelete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $tree = [
            'Teretna vozila' => [
                // 1.1 Laka teretna vozila (do ~3.5t)
                'Kombi (panel van)',
                'Pickup vozila',
                'Mali dostavni kamioni',
                'Hladnjače - mali kombi',
                // 1.2 Srednja teretna vozila (3.5t – 12t)
                'Kamioni sandučari',
                'Kamioni sa ceradom (tenda)',
                'Kamioni sa hladnjačom - srednji',
                'Kamioni kiperi - srednji',
                'Kamioni sa dizalicom (kran)',
                // 1.3 Teška teretna vozila (preko 12t)
                'Šleperi (tegljač + poluprikolica)',
                'Kamioni sa prikolicom',
                'Cisterne (gorivo, gas, hemikalije)',
                'Auto-transporter (za vozila)',
                'Hladnjače - veliki kamioni',
                'Kiperi - teški građevinski',
                'Silosi (za rasute materijale)',
            ],
            'Specijalizovana teretna vozila' => [
                'Hladnjače (temperaturni režim)',
                'Cisterne',
                'Kiperi',
                'Vozila za prevoz stoke',
                'Vozila za prevoz građevinskog materijala',
                'Vozila za opasan teret (ADR)',
                'Šlep služba (vučna vozila)',
                'Platforme / pauk vozila',
                'Pokretne radionice',
            ],
            'Dostavna vozila' => [
                'Gradska dostava (mali kombi)',
                'Ekspres dostava',
                'Kurirska vozila',
                'Last-mile delivery vozila',
                'Električna dostavna vozila',
            ],
            'Građevinska i radna vozila' => [
                'Bageri',
                'Mini bageri',
                'Utovarivači',
                'Buldožeri',
                'Valjci',
                'Kamioni kiperi - građevinski',
                'Mikseri (beton)',
                'Dizalice (kranovi)',
            ],
            'Poljoprivredna transportna vozila' => [
                'Traktori sa prikolicom',
                'Prikolice za žitarice',
                'Cisterne za vodu / đubrivo',
                'Specijalni transport za poljoprivredu',
            ],
            'Autobusi' => [
                'Minibus (do 22 sedišta)',
                'Midi autobus (23–35 sedišta)',
                'Gradski autobus',
                'Prigradski autobus',
                'Turistički autobus',
                'Zglobni autobus',
                'Dvokatni autobus',
                'Školski autobus',
                'Električni autobus',
                'Autobus za posebne namene',
            ],
            'Ostali vidovi transporta' => [
                // Železnički
                'Teretni vagoni',
                'Cisterne - železničke',
                'Kontejnerski vagoni',
                // Vodeni
                'Teretni brodovi',
                'Tankeri',
                'Kontejnerski brodovi',
                'Barže',
                // Vazdušni
                'Cargo avioni',
                'Kurirski avioni',
            ],
        ];

        foreach ($tree as $parentName => $children) {
            $parent = Category::create(['name' => $parentName]);

            foreach ($children as $childName) {
                Category::create(['name' => $childName, 'parent_id' => $parent->id]);
            }
        }
    }
}
