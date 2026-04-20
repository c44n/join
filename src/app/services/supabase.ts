import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://wqmybmnkazotvbgoaxyd.supabase.co',
      'sb_publishable_vmBnLCo9hk9k4trD30dxlQ_yK_5IoVO'
    );
  }
}