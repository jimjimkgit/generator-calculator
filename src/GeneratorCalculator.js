import React, { useState } from 'react';
import './index.css';

const GeneratorCalculator = () => {
    const [fuelType, setFuelType] = useState('gasoline');
    const [fuelAmount, setFuelAmount] = useState('');
    const [lpgTankSize, setLpgTankSize] = useState('');
    const [lpgFraction, setLpgFraction] = useState('');
    const [outlet, setOutlet] = useState('');
    const [appliances, setAppliances] = useState({
        fridge: { checked: false, quantity: 1 },
        tv: { checked: false, quantity: 1 },
        fan: { checked: false, quantity: 1 },
        microwave: { checked: false, quantity: 1 },
        coffeeMaker: { checked: false, quantity: 1 },
        toaster: { checked: false, quantity: 1 },
        dishwasher: { checked: false, quantity: 1 },
        washingMachine: { checked: false, quantity: 1 },
        dryer: { checked: false, quantity: 1 },
        computer: { checked: false, quantity: 1 },
        phoneCharger: { checked: false, quantity: 1 },
        router: { checked: false, quantity: 1 },
    });
    const [result, setResult] = useState('');

    const appliancePower = {
        fridge: 600, // Watts
        tv: 100,
        fan: 75,
        microwave: 1000,
        coffeeMaker: 800,
        toaster: 1200,
        dishwasher: 1500,
        washingMachine: 500,
        dryer: 3000,
        computer: 150,
        phoneCharger: 10,
        router: 10,
    };

    const outletLimits = {
        "6": { maxAmps: 20, voltage: 120 }, // 120V, 20A Duplex GFCI (NEMA 5-20R)
        "7": { maxAmps: 30, voltage: 120 }, // 120V, 30A Twist Lock (NEMA L5-30R)
        "8": { maxAmps: 30, voltage: 240 }, // 120/240V, 30A Twist Lock (NEMA L14-30R)
        "10": { maxAmps: 31.25, voltage: 240 } // 120/240V, 50A (NEMA 14-50R)
    };

    const lpgTankSizes = {
        "15lb": 3.5,  // 15-pound tank equals 3.5 gallons
        "20lb": 4.7,  // 20-pound tank equals 4.7 gallons
        "30lb": 7.1,  // 30-pound tank equals 7.1 gallons
        "40lb": 9.4,  // 40-pound tank equals 9.4 gallons
    };

    const handleApplianceChange = (e) => {
        const { name, checked } = e.target;
        setAppliances({
            ...appliances,
            [name]: {
                ...appliances[name],
                checked: checked,
                quantity: checked ? appliances[name].quantity : 1 // Reset to 1 if unchecked
            }
        });
    };

    const handleQuantityChange = (e, name) => {
        const { value } = e.target;
        setAppliances({
            ...appliances,
            [name]: {
                ...appliances[name],
                quantity: value > 0 ? parseInt(value, 10) : 1 // Ensure quantity is at least 1
            }
        });
    };

    const calculateFuelDuration = () => {
        if (!outlet) {
            setResult('Please select an outlet.');
            return;
        }

        let fuelInGallons = 0;

        if (fuelType === 'gasoline') {
            // For gasoline, use the gallon input directly
            fuelInGallons = parseFloat(fuelAmount);
        } else if (fuelType === 'lpg') {
            // For LPG, calculate fuel in gallons based on tank size and fraction
            if (!lpgTankSize || !lpgFraction) {
                setResult('Please select LPG tank size and fraction.');
                return;
            }

            const tankSizeInGallons = lpgTankSizes[lpgTankSize];
            fuelInGallons = tankSizeInGallons * parseFloat(lpgFraction);
        }

        if (isNaN(fuelInGallons) || fuelInGallons <= 0) {
            setResult('Please enter a valid fuel amount.');
            return;
        }

        const selectedFuelRate = fuelType === 'gasoline' ? 7500 : 6750;
        let totalLoad = 0;

        // Calculate total power consumption of selected appliances based on their quantity
        for (const appliance in appliances) {
            if (appliances[appliance].checked) {
                totalLoad += appliancePower[appliance] * appliances[appliance].quantity;
            }
        }

        if (totalLoad === 0) {
            setResult('Please select at least one appliance.');
            return;
        }

        // Check if the load is safe for the selected outlet
        const maxWatts = outletLimits[outlet].maxAmps * outletLimits[outlet].voltage;
        if (totalLoad > maxWatts) {
            setResult(`The total load of ${totalLoad}W exceeds the maximum capacity of ${maxWatts}W for the selected outlet.`);
            return;
        }

        // Calculate fuel duration
        const availablePower = fuelInGallons * selectedFuelRate;
        const hours = availablePower / totalLoad;

        setResult(`The generator will run for approximately ${hours.toFixed(2)} hours with the selected load.`);
    };

    return (
        <div className="calculator">
            <h2>Generator Fuel Duration Calculator</h2>
            <form>
                <div>
                    <label>Fuel Type:</label>
                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                        <option value="gasoline">Gasoline</option>
                        <option value="lpg">LPG</option>
                    </select>
                </div>

                {fuelType === 'gasoline' && (
                    <div>
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
                    <div>
                        <label>LPG Tank Size:</label>
                        <select value={lpgTankSize} onChange={(e) => setLpgTankSize(e.target.value)}>
                            <option value="">Select Tank Size</option>
                            <option value="15lb">15 lb (3.5 gal)</option>
                            <option value="20lb">20 lb (4.7 gal)</option>
                            <option value="30lb">30 lb (7.1 gal)</option>
                            <option value="40lb">40 lb (9.4 gal)</option>
                        </select>
                    </div>
                )}

                {fuelType === 'lpg' && (
                    <div>
                        <label>LPG Tank Fraction:</label>
                        <select value={lpgFraction} onChange={(e) => setLpgFraction(e.target.value)}>
                            <option value="">Select Fraction</option>
                            <option value="0.25">1/4 Tank</option>
                            <option value="0.5">1/2 Tank</option>
                            <option value="0.75">3/4 Tank</option>
                            <option value="1">Full Tank</option>
                        </select>
                    </div>
                )}

                <div>
                    <label>Outlet:</label>
                    <select value={outlet} onChange={(e) => setOutlet(e.target.value)}>
                        <option value="">Select Outlet</option>
                        <option value="6">6 - 120V, 20A Duplex GFCI (NEMA 5-20R)</option>
                        <option value="7">7 - 120V, 30A Twist Lock (NEMA L5-30R)</option>
                        <option value="8">8 - 120/240V, 30A Twist Lock (NEMA L14-30R)</option>
                        <option value="10">10 - 120/240V, 50A (NEMA 14-50R)</option>
                    </select>
                </div>

                <div>
                    <label>Select Appliances:</label><br />
                    {Object.keys(appliancePower).map((appliance) => (
                        <div key={appliance}>
                            <input
                                type="checkbox"
                                name={appliance}
                                checked={appliances[appliance].checked}
                                onChange={handleApplianceChange}
                            /> {`${appliance.charAt(0).toUpperCase() + appliance.slice(1)} (${appliancePower[appliance]}W)`}
                            {appliances[appliance].checked && (
                                <div>
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        value={appliances[appliance].quantity}
                                        min="1"
                                        onChange={(e) => handleQuantityChange(e, appliance)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button type="button" onClick={calculateFuelDuration}>Calculate</button>
            </form>
            {result && <div className="result">{result}</div>}
        </div>
    );
};

export default GeneratorCalculator;
