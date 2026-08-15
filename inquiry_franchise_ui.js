/* ==========================================
   FRANCHISE DROPDOWN
========================================== */

import {
    franchiseSelect
} from './inquiry_elements.js';


/* ==========================================
   POPULATE FRANCHISES
========================================== */

export function populateFranchises(
    franchises
){

    franchiseSelect.innerHTML = '';


    const defaultOption =
        document.createElement(
            'option'
        );

    defaultOption.value = '';

    defaultOption.textContent =
        'Select a branch';


    franchiseSelect.appendChild(
        defaultOption
    );


    franchises
        .filter(
            franchise =>
                franchise.status ===
                'active'
        )
        .sort(
            (a,b) =>
                a.name.localeCompare(
                    b.name
                )
        )
        .forEach(
            franchise => {

                const option =
                    document.createElement(
                        'option'
                    );

                option.value =
                    franchise.id;

                option.textContent =
                    franchise.name;


                franchiseSelect.appendChild(
                    option
                );

            }
        );

}


/* ==========================================
   FRANCHISE LOADING
========================================== */

export function showFranchiseLoading(){

    franchiseSelect.innerHTML = '';


    const option =
        document.createElement(
            'option'
        );

    option.value = '';

    option.textContent =
        'Loading branches...';


    franchiseSelect.appendChild(
        option
    );

}


/* ==========================================
   FRANCHISE ERROR
========================================== */

export function showFranchiseError(){

    franchiseSelect.innerHTML = '';


    const option =
        document.createElement(
            'option'
        );

    option.value = '';

    option.textContent =
        'Unable to load branches';


    franchiseSelect.appendChild(
        option
    );

}
