import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { cors } from "hono/cors";

interface TeamMember{
  application_id:string,
  member_name:string,
  member_email:string,
  member_phone:string
}

const api = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICEROLE_KEY: string;
  };
}>();
api.use(cors())
api.post("/hackathon", async (c) => {
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICEROLE_KEY
  );

  const body = await c.req.json();

  const { data, error } = await supabase.from("hackathons").insert([body]);

  if (error) return c.json({ error: error.message }, 400);

  return c.json({ message: "Hackathon added", data }, 201);
});
api.get('/hackathon',async(c)=>{
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICEROLE_KEY
  );
  const {data,error} = await supabase.from('hackathons').select('*');
  if(error){
    console.log(error.cause)
    return c.json({

      message:error.message
    },500)
  }
  return c.json(data);
})

api.get('/hackathon/:id',async(c)=>{
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICEROLE_KEY
  );
  const id = c.req.param('id');
  const {data,error} = await supabase.from('hackathons').select('*').eq('id',id);
  if(error){
    return c.json({
      message:error.message
    },500)
  }
  return c.json(data);
})

api.post('/hackathon/apply',async(c)=>{
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICEROLE_KEY
  );
  const id = c.req.param('id');
  const {application,teamMembers} = await c.req.json();
  const {data,error} = await supabase.from('applications').insert([application]).select('id');
  
  const appId = data!=null?data[0].id:"null";
  const teamMembersWithAppId = teamMembers.map((member:TeamMember) => ({
    ...member,
    application_id: appId, 
  }));
  const {data:teamData,error:teamError}  = await supabase.from('team_members').insert(teamMembersWithAppId);
  if(error){
    return c.json({
      msg:error.message
    },500)
  }
  if(teamError){
    return c.json({
      msg:teamError
    },500)
  }
  return c.json({msg:"reached"});

})

//------------------------------------------------------------------------------------

api.post("/projects", async (c) => {
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICEROLE_KEY
  );

  const body = await c.req.json();

  const { data, error } = await supabase.from("projects").insert([body]);

  if (error) return c.json({ error: error.message }, 400);

  return c.json({ message: "Project added", data }, 201);
});


export default api;
