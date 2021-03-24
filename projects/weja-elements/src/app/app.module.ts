

import { BrowserModule       	} from '@angular/platform-browser';
import { NgModule			  	} from '@angular/core';
import { Injector 			 	} from '@angular/core';
import { createCustomElement 	} from '@angular/elements';
import { WejaLibraryModule   	} from '../../../weja-library/src/lib/weja-library.module';
import { WejaLibraryComponent	} from '../../../weja-library/src/lib/weja-library.component';

@NgModule({ imports: [ BrowserModule, WejaLibraryModule ], providers: []})

export class AppModule {
	
	constructor( private injector: Injector ) {}
	
	ngDoBootstrap() {
		const element = createCustomElement( WejaLibraryComponent, { injector: this.injector })
		customElements.define("weja-library-element-hello", element );
	}
}
