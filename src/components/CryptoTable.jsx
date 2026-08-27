export default function CryptoTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Símbolo</th>
          <th>Precio (USD)</th>
          <th>Cambio 24h</th>
          <th>Volumen</th>
          <th>Capitalización</th>
        </tr>
      </thead>
      <tbody>
        {data.map((coin, index) => (
          <tr key={coin.id}>
            <td>{index + 1}</td>
            <td>
              <img src={coin.image} alt={coin.name} width="20" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {coin.name}
            </td>
            <td>{coin.symbol.toUpperCase()}</td>
            <td>${coin.current_price.toLocaleString()}</td>
            <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
