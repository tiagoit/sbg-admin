export class Event {
    _id: String;
    code: String;
    orgCode: String;
    orgName: String;
    orgImage: String;
    cityCode: String;
    cityName: String;
    title: String;
    start: Date;
    end: Date;
    site: String;
    description: Text;
    images: String[];
    tags: String[];
    featured: Boolean;
    size: Number;

    constructor() {
        this.images = new Array<String>();
        this.images[0] = '';
        this.images[1] = '';
        this.images[2] = '';
        this.images[3] = '';

        this.tags = new Array<string>();
    }
}

export class City {
    _id: String;
    code: String;
    order: String;
    name: String;
    regionID: String;
    status: Boolean;
}

export class Org {
    _id: String;
    code: String;
    name: String;
    cityCode: String;
    site: String;
    address: Address;
    contacts: Contact[];
    mobile: String;
    land: String;
    email: String;
    description: String;
    images: String[];
    status: Boolean;

    constructor() {
        this.address = new Address();
        this.contacts = [];
        this.contacts[0] = new Contact();
        this.images = new Array<String>();
        this.images[0] = '';
        this.images[1] = '';
        this.images[2] = '';
        this.images[3] = '';
    }
}

class Address {
    state: String;
    city: String;
    neighborhood: String;
    street: String;
    number: String;
    complement: String;
    zipCode: String;
}

class Contact {
    name: String;
    email: String;
    mobile: String;
    role: String;
    notes: String;
}

export class Tag {
    code: String;
    title: String;
    status: Boolean;
    featured: Boolean;
    childrenTags: String[];

    constructor(title: string, code: string, status?: Boolean) {
        this.title = title;
        this.code = code;
        this.status = status || true;
    }
}