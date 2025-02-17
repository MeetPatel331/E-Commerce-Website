import React from 'react'

const GunRack = () => {
    return (
        <div className='gunrack'>
            <div className='info'>
                <h1>Gun Rack Features</h1>
                <div style={{ width: '70px', height: '2px', backgroundColor: '#A97A5B',display:'block',marginInline:'auto' }}></div>
                <p>Rear seat or back seat compatible, multifunctional dual slings. One pair comes with two sets of slings that have adjustable d-rings to suite various sizes of gear. We use only the thickest hides of leather, ensuring unmatched durability and a lifetime of reliable use.</p>
            </div>
            <div className='images'>
                <div>
                    <img src="https://www.stsslings.com/cdn/shop/files/Image_11.jpg?v=1715766278" alt="" />
                    <h2>Compatible With Front Seat</h2>
                </div>
                <div>
                    <img src="https://www.stsslings.com/cdn/shop/files/Image_12.jpg?v=1715766278" alt="" />
                    <h2>Compatible With Back Seat</h2>
                </div>
            </div>
        </div>
    )
}

export default GunRack