import React from 'react';
import '../App.css';
import Header from '../parts/Header';

function Pagemaker() {
    return (
        <div className="Pagemaker">
            {/*WIP will add more features later like custom colors.*/}
            <Header />
            <div className='Pagemaker_content'>
                <h1>Create your own page!</h1>
                <div className='Pagemaker_form'>
                    <form>
                        <input type="text" placeholder="Title" required minLength={3} maxLength={30} />
                        <input type="file" name="" id="" required />
                        <textarea name="" id="" cols="30" rows="10" placeholder="Description" maxLength={500}></textarea>
                        <button type="submit" className='btn'>Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Pagemaker;