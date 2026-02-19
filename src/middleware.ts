import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. LOG DE DEBUG: Se isso não aparecer no terminal onde o servidor roda, o arquivo está sendo ignorado!
  console.log('🚨 [MIDDLEWARE INTERCEPTOU] -> Rota:', request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. TRAVA DE SEGURANÇA (Evita o "Fail Open")
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERRO GRAVE: Variáveis do Supabase ausentes no Middleware!');
    // Se não achar o .env, bloqueia o acesso por segurança e manda pro login.
    return NextResponse.redirect(new URL('/login?error=env_missing', request.url));
  }

  // 3. INICIALIZAÇÃO DO SUPABASE
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // 4. VERIFICAÇÃO DE AUTENTICAÇÃO
  const { data: { user } } = await supabase.auth.getUser();
  console.log('👤 [STATUS DO USER] ->', user ? `Autenticado: ${user.email}` : 'NÃO AUTENTICADO');

  const { pathname } = request.nextUrl;

  // 5. LISTA DE ROTAS PRIVADAS
  const isPrivateRoute = pathname.startsWith('/adminpage') ||
                         pathname.startsWith('/admin-campanha') ||
                         pathname.startsWith('/player');

  // Se a rota for privada e não tiver usuário logado = RUA!
  if (isPrivateRoute && !user) {
    console.log('⛔ [BLOQUEADO] Anônimo tentando acessar rota protegida. Chutando pro /login...');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 6. PROTEÇÃO DE ROTAS POR CARGO (ROLE) - Só roda se o cara estiver logado
  if (user) {
    const role = user.user_metadata?.role;

    if ((pathname.startsWith('/adminpage') || pathname.startsWith('/admin-campanha')) && role !== 'admin') {
       console.log('⛔ [BLOQUEADO] Player tentando dar uma de Admin.');
       return NextResponse.redirect(new URL('/player', request.url));
    }

    if (pathname.startsWith('/player') && role === 'admin') {
       console.log('🔄 [REDIRECIONADO] Admin entrando na área de Player. Voltando pro dashboard...');
       return NextResponse.redirect(new URL('/adminpage', request.url));
    }
  }

  console.log('✅ [PERMITIDO] Acesso liberado para ->', pathname);
  return supabaseResponse;
}

export const config = {
  // Esse matcher pega TODAS as rotas, exceto arquivos de sistema do Next, imagens e ícones.
  // Assim garantimos que o Next.js não vai escapar da verificação.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};