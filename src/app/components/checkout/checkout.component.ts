import { Country } from './../../common/country';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { State } from '../../common/state';
import { MikeShopValidators } from '../../validators/mike-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup!: FormGroup;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService
  ) { }

  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), MikeShopValidators.notOnlyWhiteSpace]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
        Validators.minLength(2), MikeShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    })
    //populate credit card month and year
    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }

  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress']
        .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      //bugfix fix for states
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      this.checkOutFormGroup.controls['billingAddress'].reset()
      //bugfix fix for states
      this.billingAddressStates = [];
    }
  }


  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(
      (data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data
        } else {
          this.billingAddressStates = data
        }
        console.log(data[0]);
        //select first item default
        formGroup?.get('state')?.setValue(data[0]);

      }
    )
  }
}
