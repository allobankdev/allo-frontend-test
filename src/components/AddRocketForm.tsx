import { useState, type FormEvent } from 'react';
import { useRocketStore } from '../store/rocketStore';
import type { Rocket } from '../types/rocket';
import './AddRocketForm.css';

export default function AddRocketForm() {
  const addLocalRocket = useRocketStore((s) => s.addLocalRocket);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    const newRocket: Rocket = {
      id: Date.now(),
      full_name: name.trim(),
      description: description.trim(),
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: { country_code: 'N/A' },
    };

    addLocalRocket(newRocket);
    setName('');
    setDescription('');
  }

  return (
    <form className="add-rocket-form" onSubmit={handleSubmit}>
      <h2 className="add-rocket-form__title">Add Local Rocket</h2>
      <div className="add-rocket-form__fields">
        <input
          id="rocket-name"
          className="add-rocket-form__input"
          type="text"
          placeholder="Rocket name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          id="rocket-description"
          className="add-rocket-form__textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button className="add-rocket-form__submit" type="submit">
          Add Rocket
        </button>
      </div>
    </form>
  );
}
