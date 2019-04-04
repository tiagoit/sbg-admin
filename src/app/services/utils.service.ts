import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() {}

  removeAcentos(str: String): String {                        
    str = str.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    str = str.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    str = str.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    str = str.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    str = str.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    str = str.replace(new RegExp('[Ç]','gi'), 'c');
    str = str.replace('\'', '');
    return str;
  }

  public encodeToUrl(str: String): String {
    str = str.toLowerCase().replace(/ /g , '-');
    return this.removeAcentos(str);
  }
}
