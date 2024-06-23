import { FormControl, ValidationErrors } from "@angular/forms";

export class MikeShopValidators {
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null{

        //check if string only contains white space
        if ((control.value != null) && control.value.trim().length === 0) {
            return { 'notOnlyWhiteSpace': true }
        }
        else {
            return null;
        }
    }
}
