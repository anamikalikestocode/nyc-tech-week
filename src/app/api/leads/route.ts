import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // TODO: When Supabase is connected, insert into leads table:
  // const supabase = createAdminClient();
  // await supabase.from('leads').insert({
  //   partner_id: (await supabase.from('partners').select('id').eq('slug', body.partnerSlug).single()).data?.id,
  //   name: body.name,
  //   email: body.email,
  //   phone: body.phone,
  //   travel_dates: body.dates,
  //   group_size: body.groupSize,
  //   message: body.message,
  // });

  console.log("Lead received:", body);

  return NextResponse.json({ success: true });
}
