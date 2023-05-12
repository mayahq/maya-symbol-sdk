# mayalabs_symbol
### library is still under active development
Mayalabs Symbol is a SDK for developing addon modules that expand functions of Mayalabs' Flow based compute runtime.

To use import the Symbol class and extend the module classes using it as
```Typescript

import Symbol from 'https://deno.land/x/mayalabs_symbols/mods.ts'

class MyCoolFeature extends Symbol {
// class implementation

onInit() {
    //setup logic if any
}

onMessage() {
    //actual functional logic
}

}
```