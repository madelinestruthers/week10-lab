import Country from './Country';

const Countries = ({ countries }) => {
  return (
    <div className="countries-container">
      {countries.map((country) => (
        <div className="country-card" key={country.cca3}>
          <Country country={country} />
        </div>
      ))}
    </div>
  );
};

export default Countries;
