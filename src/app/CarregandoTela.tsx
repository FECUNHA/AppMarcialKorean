/** Aparece enquanto o chunk de uma tela de módulo carrega (abertura direta numa rota de módulo). */
export function CarregandoTela() {
  return (
    <main className="tela" aria-busy="true">
      <p>Carregando…</p>
    </main>
  )
}
