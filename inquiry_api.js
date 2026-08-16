const FRANCHISE_API='https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/get_franchises';
const INQUIRY_API='https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_inquiry_history';
const ACTIVE_INQUIRY_API='https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_inquiry_history_active';
const HISTORY_API='https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_get_history';
const REOPEN_INQUIRY_API='https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_set_inquiry_history_to_null';

function getAuthToken(){
    return localStorage.getItem('authToken');
}

/* GET FRANCHISES */

export async function getFranchises(){
    const authToken=getAuthToken();

    if(!authToken){
        throw new Error('Authentication token not found.');
    }

    const response=await fetch(
        FRANCHISE_API,
        {
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization':`Bearer ${authToken}`
            }
        }
    );

    if(!response.ok){
        throw new Error(
            `Unable to load franchises. HTTP ${response.status}`
        );
    }

    return await response.json();
}

/* GET ACTIVE INQUIRIES */

export async function getActiveInquiries(){
    const authToken=getAuthToken();

    if(!authToken){
        throw new Error('Authentication token not found.');
    }

    const response=await fetch(
        ACTIVE_INQUIRY_API,
        {
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization':`Bearer ${authToken}`
            }
        }
    );

    if(!response.ok){
        throw new Error(
            `Unable to load inquiries. HTTP ${response.status}`
        );
    }

    const result=await response.json();

    return result.qna_inquiry_history || [];
}

/* GET CLOSED INQUIRIES */

export async function getClosedInquiries(
    dateFrom,
    dateTo
){
    const authToken=getAuthToken();

    if(!authToken){
        throw new Error('Authentication token not found.');
    }

    const response=await fetch(
        `${HISTORY_API}?date_from=${dateFrom}&date_to=${dateTo}`,
        {
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization':`Bearer ${authToken}`
            }
        }
    );

    if(!response.ok){
        const errorText=await response.text();

        throw new Error(
            errorText ||
            `Unable to load closed inquiries. HTTP ${response.status}`
        );
    }

    const result=await response.json();

    return result.qna_inquiry_history || [];
}

/* REOPEN CLOSED INQUIRY */

export async function reopenInquiry(
    inquiryId
){
    const authToken=getAuthToken();

    if(!authToken){
        throw new Error('Authentication token not found.');
    }

    const response=await fetch(
        REOPEN_INQUIRY_API,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${authToken}`
            },
            body:JSON.stringify({
                id:inquiryId
            })
        }
    );

    if(!response.ok){
        const errorText=await response.text();

        throw new Error(
            errorText ||
            `Unable to reopen inquiry. HTTP ${response.status}`
        );
    }

    return await response.json();
}

/* CREATE INQUIRY */

export async function createInquiry(
    parentName,
    franchiseId
){
    const authToken=getAuthToken();

    if(!authToken){
        throw new Error('Authentication token not found.');
    }

    const response=await fetch(
        INQUIRY_API,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${authToken}`
            },
            body:JSON.stringify({
                parent_name:parentName,
                franchise_id:franchiseId,
                source:'Facebook',
                status:'new'
            })
        }
    );

    if(!response.ok){
        const errorText=await response.text();

        throw new Error(
            errorText ||
            'Unable to create inquiry.'
        );
    }

    const result=await response.json();

    return result.qna_inquiry_history;
}
