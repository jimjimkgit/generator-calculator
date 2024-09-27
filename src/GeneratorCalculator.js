import React, { useState } from 'react';
import './index.css';

const GeneratorCalculator = () => {
    const [fuelType, setFuelType] = useState('lpg'); // Default to LPG
    const [fuelAmount, setFuelAmount] = useState('1'); // Default to full tank
    const [appliances, setAppliances] = useState({});
    const [result, setResult] = useState('');

    // Assume a full LPG 15lb tank is 3.5 gallons
    const lpgFullTankGallons = 3.5;

    // List of common household appliances with typical wattage
    const applianceList = [
        { name: 'Refrigerator', key: 'fridge', wattage: 600 },
        { name: 'TV', key: 'tv', wattage: 100 },
        { name: 'Fan', key: 'fan', wattage: 75 },
        { name: 'Phone Charger', key: 'phoneCharger', wattage: 10 },
        { name: 'Laptop Charger', key: 'laptopCharger', wattage: 60 },
        { name: 'Internet Router', key: 'router', wattage: 15 },
        { name: 'Wi-Fi Point', key: 'wifiPoint', wattage: 15 },
        // Add more appliances as needed
    ];

    // Handle change in quantity for each appliance
    const handleApplianceChange = (e, key) => {
        const { value } = e.target;
        const quantity = parseInt(value, 10);
        setAppliances({ ...appliances, [key]: quantity > 0 ? quantity : 0 });
    };

    const calculateFuelDuration = () => {
        let totalLoad = 0;

        // Calculate the total power load based on selected appliances and their quantities
        applianceList.forEach(appliance => {
            const quantity = appliances[appliance.key] || 0;
            totalLoad += appliance.wattage * quantity;
        });

        if (totalLoad === 0 || (!fuelAmount && fuelType === 'gasoline') || (!fuelAmount && fuelType === 'lpg')) {
            setResult('Please enter fuel amount and select at least one appliance with quantity.');
            return;
        }

        let totalFuelAvailable; // in gallons
        let fuelConsumptionPerHour; // in gallons per hour

        if (fuelType === 'gasoline') {
            totalFuelAvailable = parseFloat(fuelAmount);
            // Approximate fuel consumption per hour for gasoline (in gallons)
            // Assuming 0.75 gallons/hour at 50% load for a typical 7500W generator
            fuelConsumptionPerHour = 0.75 * (totalLoad / 3750);
        } else if (fuelType === 'lpg') {
            totalFuelAvailable = parseFloat(fuelAmount) * lpgFullTankGallons;
            // Approximate fuel consumption per hour for LPG (in gallons)
            // Assuming 1.5 gallons/hour at 50% load for a typical 7500W generator
            fuelConsumptionPerHour = 1.5 * (totalLoad / 3750);
        }

        // Prevent division by zero or very small fuel consumption values
        if (fuelConsumptionPerHour <= 0) {
            setResult('Fuel consumption rate is too low to be realistic.');
            return;
        }

        // Calculate hours of operation based on available fuel and consumption rate
        const hours = totalFuelAvailable / fuelConsumptionPerHour;

        setResult(`The generator will run for approximately ${hours.toFixed(2)} hours.`);
    };

    return (
        <div className="calculator">
            <h2>Generator Fuel Duration Calculator</h2>
            <form>
                <div className="form-group">
                    <label>Fuel Type:</label>
                    <select value={fuelType} onChange={(e) => {
                        setFuelType(e.target.value);
                        setFuelAmount('1'); // Reset to full tank
                    }}>
                        <option value="gasoline">Gasoline</option>
                        <option value="lpg">LPG</option>
                    </select>
                </div>

                {fuelType === 'gasoline' && (
                    <div className="form-group">
                        <label>Fuel Amount (gallons):</label>
                        <input
                            type="number"
                            value={fuelAmount}
                            onChange={(e) => setFuelAmount(e.target.value)}
                            step="0.1"
                        />
                    </div>
                )}

                {fuelType === 'lpg' && (
                    <div className="form-group">
                        <label>Fuel Amount (fraction of 15lb tank):</label>
                        <select
                            value={fuelAmount}
                            onChange={(e) => setFuelAmount(parseFloat(e.target.value))}
                        >
                            <option value="0.25">1/4 Tank (0.875 gal)</option>
                            <option value="0.5">1/2 Tank (1.75 gal)</option>
                            <option value="0.75">3/4 Tank (2.625 gal)</option>
                            <option value="1">Full Tank (3.5 gal)</option>
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Select Appliances and Quantity:</label>
                    {applianceList.map(appliance => (
                        <div className="appliance-item" key={appliance.key}>
                            <label>{appliance.name} ({appliance.wattage}W):</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                onChange={(e) => handleApplianceChange(e, appliance.key)}
                            />
                        </div>
                    ))}
                </div>

                <button type="button" className="calculate-btn" onClick={calculateFuelDuration}>Calculate</button>
            </form>
            {result && <div className="result">{result}</div>}
        </div>
    );
};

export default GeneratorCalculator;
