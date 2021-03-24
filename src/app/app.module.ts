

import { BrowserModule   		} from '@angular/platform-browser';
import { NgModule        		} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA	} from '@angular/core';
import { AppComponent    		} from './app.component';
import { HelloComponent			} from './hello/hello.component';
// import { WejaComponentsModule	} from 'weja-library';

@NgModule({
	declarations:	[AppComponent, HelloComponent],
// 	imports:		[BrowserModule, WejaComponentsModule],
	imports:		[BrowserModule],
	providers:		[],
	schemas:		[CUSTOM_ELEMENTS_SCHEMA],
	bootstrap:		[AppComponent]
})

export class AppModule { }
