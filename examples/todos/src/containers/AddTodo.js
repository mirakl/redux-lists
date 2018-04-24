import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTodo } from '../actions';

let countId = 0;

const AddTodo = ({ addTodo }) => {
    let input;

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (!input.value.trim()) {
                        return;
                    }
                    addTodo({
                        id: countId++,
                        text: input.value,
                        completed: false,
                    });
                    input.value = '';
                }}
            >
                <input ref={node => (input = node)} />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    );
};

AddTodo.propTypes = {
    addTodo: PropTypes.func,
};

const mapDispatchToProps = { addTodo };

export default connect(null, mapDispatchToProps)(AddTodo);
