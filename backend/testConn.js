class testFns{
    async testSupabase(){
        try{
            const{data,error} = await supabase.from('dustbins').select('*').limit(1);
    
            if(error){
                console.error('error fetching supabase -->', error.message);
    
            }else{
                console.log('Test sucessful -->', data);
    
            }
            
            }catch(err){
                 console.error('Unexpected error -->', err);
            }
    }
}
//---------------------------------------------------------------------------------------------
//!Below code part is to test connection between database
import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

// dotenv.config({ path: './backend/.env' });
dotenv.config();
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAPI  = process.env.SERVICE_ROLE_API_KEY;
const supabaseAPI  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseURL,supabaseAPI);

//? Below line is for debugging dont remove it
// console.log('Loaded the dotenv sucessfully',supabaseURL);
// console.log("API_KEY:", supabaseAPI);

//? instance/object of the class testSupabase
const obj_testSupabase = new testFns();  

obj_testSupabase.testSupabase();